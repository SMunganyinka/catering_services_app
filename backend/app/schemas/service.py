from pydantic import BaseModel

class ServiceBase(BaseModel):
    name: str
    description: str | None
    price_per_person: float

class ServiceCreate(ServiceBase):
    provider_id: int

class ServiceResponse(ServiceBase):
    id: int
    provider_id: int
    class Config:
        orm_mode = True
