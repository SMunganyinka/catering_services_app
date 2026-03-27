from pydantic import BaseModel

class ProviderBase(BaseModel):
    business_name: str
    location: str | None
    phone: str | None

class ProviderCreate(ProviderBase):
    user_id: int

class ProviderResponse(ProviderBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True
