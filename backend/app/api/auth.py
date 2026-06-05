from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserRead, UserUpdate, Token, UserOTPVerify, ForgotPasswordRequest, ResetPasswordRequest
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.core.dependencies import get_current_user

router = APIRouter()

@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email zaten kullanımda")
    hashed_pwd = hash_password(user.password)
    new_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pwd,
        role=user.role,
        avatar_url=user.avatar_url,
        bio=user.bio,
        interests=user.interests
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.id})
    refresh_token = create_refresh_token(data={"sub": new_user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Geçersiz email veya şifre")
        
    import random
    from datetime import datetime, timedelta, timezone
    
    # OTP bypass
    # otp = f"{random.randint(10000, 99999)}"
    # user.otp_code = otp
    # user.otp_expires_at = datetime.utcnow() + timedelta(minutes=5)
    # db.commit()
    # 
    # from app.core.email import send_otp_email
    # send_otp_email(user.email, otp)
    # 
    # return {"status": "otp_required", "email": user.email}
    
    # Update last login and streak immediately
    today_str = datetime.now(timezone.utc).replace(tzinfo=None).strftime("%Y-%m-%d")
    if user.last_login_date != today_str:
        if user.last_login_date:
            last_date = datetime.strptime(user.last_login_date, "%Y-%m-%d")
            delta = (datetime.now(timezone.utc).replace(tzinfo=None) - last_date).days
            if delta == 1:
                user.streak_days = (user.streak_days or 0) + 1
            else:
                user.streak_days = 1
        else:
            user.streak_days = 1
        user.last_login_date = today_str
        db.commit()
        
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "status": "success"}

@router.post("/verify-otp", response_model=Token)
def verify_otp(otp_data: UserOTPVerify, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        
    from datetime import datetime, timezone
    if not user.otp_code or not user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Doğrulama kodu oluşturulmamış")
        
    if datetime.now(timezone.utc).replace(tzinfo=None) > user.otp_expires_at:
        raise HTTPException(status_code=400, detail="Doğrulama kodunun süresi dolmuş")
        
    if user.otp_code != otp_data.code:
        raise HTTPException(status_code=400, detail="Geçersiz doğrulama kodu")
        
    # Clear OTP
    user.otp_code = None
    user.otp_expires_at = None
    db.commit()
    
    # Update last login and streak
    today_str = datetime.now(timezone.utc).replace(tzinfo=None).strftime("%Y-%m-%d")
    if user.last_login_date != today_str:
        if user.last_login_date:
            last_date = datetime.strptime(user.last_login_date, "%Y-%m-%d")
            delta = (datetime.now(timezone.utc).replace(tzinfo=None) - last_date).days
            if delta == 1:
                user.streak_days = (user.streak_days or 0) + 1
            else:
                user.streak_days = 1
        else:
            user.streak_days = 1
        user.last_login_date = today_str
        db.commit()
        
    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer", "status": "success"}

@router.post("/refresh", response_model=Token)
def refresh_token(token_data: dict):
    # normally decode refresh token and issue new access token
    pass

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    import json
    try:
        badges_list = json.loads(current_user.badges) if current_user.badges else []
    except:
        badges_list = []
        
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "bio": current_user.bio,
        "interests": current_user.interests,
        "badges": badges_list,
        "xp": current_user.xp or 0,
        "streak_days": current_user.streak_days or 0
    }

@router.put("/profile")
def update_profile(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.avatar_url:
        current_user.avatar_url = user_update.avatar_url
    if user_update.bio:
        current_user.bio = user_update.bio
    if user_update.interests:
        current_user.interests = user_update.interests
    db.commit()
    db.refresh(current_user)
    
    import json
    try:
        badges_list = json.loads(current_user.badges) if current_user.badges else []
    except:
        badges_list = []
        
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "avatar_url": current_user.avatar_url,
        "bio": current_user.bio,
        "interests": current_user.interests,
        "badges": badges_list,
        "xp": current_user.xp or 0,
        "streak_days": current_user.streak_days or 0
    }


@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı")
    
    import uuid
    from datetime import datetime, timedelta, timezone
    
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    user.reset_token_expires_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
    db.commit()
    
    # Send email
    from app.core.email import send_reset_email
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}&email={user.email}"
    
    success = send_reset_email(user.email, reset_link)
    if not success:
        raise HTTPException(status_code=500, detail="Şifre sıfırlama e-postası gönderilemedi")
         
    return {"message": "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi"}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
        
    from datetime import datetime, timezone
    if not user.reset_token or not user.reset_token_expires_at:
        raise HTTPException(status_code=400, detail="Şifre sıfırlama talebi bulunamadı")
        
    if datetime.now(timezone.utc).replace(tzinfo=None) > user.reset_token_expires_at:
        raise HTTPException(status_code=400, detail="Şifre sıfırlama bağlantısının süresi dolmuş")
        
    if user.reset_token != req.token:
        raise HTTPException(status_code=400, detail="Geçersiz şifre sıfırlama bağlantısı")
        
    # Reset password
    user.hashed_password = hash_password(req.password)
    # Clear reset token
    user.reset_token = None
    user.reset_token_expires_at = None
    db.commit()
    
    return {"message": "Şifreniz başarıyla güncellendi"}

