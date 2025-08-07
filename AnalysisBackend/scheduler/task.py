# <<<<<<< codespace-fluffy-space-eureka-vjxx6q9vxrj2q4v

# """
# Micro-service « Reminder Service » pour composer puis (éventuellement) envoyer
# des rappels multilingues à partir du dictionnaire statique dico.json.

# Usage :
#     uvicorn task:app --reload
#     curl -X POST http://localhost:8001/compose -H "Content-Type: application/json" \
#          -d '{"reminder_type":"appointment","language":"FR","name":"Jean","date":"18/07/2025","time":"09:00","hospital":"Hôpital Général de Douala"}'
# """

# from __future__ import annotations

# import json
# import os
# from pathlib import Path
# from typing import Literal, Optional
# import logging

# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel, Field, field_validator

# logging.basicConfig(level=logging.INFO)

# # --------------------------------------------------------------------------- #
# # Chargement du dictionnaire                                                  #
# # --------------------------------------------------------------------------- #


# _dico_env = os.getenv("DICO_PATH", "dico.json")
# DICO_PATH = Path(_dico_env)
# if not DICO_PATH.is_absolute():
#     # Toujours relatif au dossier du script
#     DICO_PATH = Path(__file__).parent / DICO_PATH

# try:
#     with DICO_PATH.open(encoding="utf-8") as fp:
#         TEMPLATES: dict[str, dict[str, str]] = json.load(fp)
# except FileNotFoundError as exc:
#     raise SystemExit(
#         f"[ERREUR] Fichier dictionnaire introuvable : {DICO_PATH.resolve()}"
#     ) from exc
# except json.JSONDecodeError as exc:
#     raise SystemExit(f"[ERREUR] dico.json invalide : {exc}") from exc

# SUPPORTED_TYPES = set(TEMPLATES.keys())            # {"appointment", "medication"}
# SUPPORTED_LANGS = {lang for t in TEMPLATES.values() for lang in t.keys()}

# # --------------------------------------------------------------------------- #
# #  Modèles Pydantic                                                           #
# # --------------------------------------------------------------------------- #

# class ReminderRequest(BaseModel):
#     """Schéma d’entrée API : données nécessaires pour un rappel."""
#     reminder_type: Literal["appointment", "medication"] = Field(
#         ..., description="Type de rappel"
#     )
#     language: Literal["FR", "EN", "DLA", "BASSA", "EWONDO"] = Field(
#         ..., description="Code langue (voir dictionnaire)"
#     )
#     name: str = Field(..., description="Nom du patient")
#     time: str = Field(..., description="Heure sous forme lisible (ex : 09:00)")
#     # Les champs suivants ne sont pas requis pour les deux types de rappel,
#     # mais on les laisse facultatifs ; la validation ajustera.
#     date: Optional[str] = Field(None, description="Date du rendez-vous ex : 18/07/2025")
#     hospital: Optional[str] = Field("Hôpital Général de Douala", description="Nom de l'hôpital")
#     phone_number: Optional[str] = Field(
#         None, description="Numéro du patient (+237…)"
#     )

#     # Validation contextuelle : si type=appointment, le champ date doit être présent
#     @field_validator("date", mode="after")
#     @classmethod
#     def _require_date_for_appointment(cls, v, info):
#         reminder_type = info.data.get("reminder_type")
#         if reminder_type == "appointment" and not v:
#             raise ValueError("date requis pour un rappel de rendez-vous")
#         return v

# class ReminderResponse(BaseModel):
#     message: str
#     sent: bool = False
#     sms_sid: Optional[str] = None     # Twilio SID, présent si SMS envoyé

# # --------------------------------------------------------------------------- #
# #  Service de composition                                                     #
# # --------------------------------------------------------------------------- #

# class ReminderService:
#     """Charge les templates et génère les messages."""
#     def __init__(self, templates: dict[str, dict[str, str]]):
#         self.templates = templates

#     def compose(
#         self,
#         reminder_type: str,
#         language: str,
#         *,
#         name: str,
#         time: str,
#         date: Optional[str] = None,
#         hospital: Optional[str] = None,
#     ) -> str:
#         try:
#             template = self.templates[reminder_type][language]
#         except KeyError:
#             raise KeyError(
#                 f"Template manquant pour type={reminder_type}, langue={language}"
#             )

#         # Remplacement naïf des variables dynamiques
#         msg = (
#             template.replace("{{name}}", name)
#             .replace("{{time}}", time)
#             .replace("{{date}}", date or "")
#             .replace("{{hospital}}", hospital or "")
#         )

#         # Nettoyage double-espace si date absente (cas medication)
#         return " ".join(msg.split())

# # --------------------------------------------------------------------------- #
# #  (Optionnel) – Client SMS Twilio                                            #
# # --------------------------------------------------------------------------- #

# class SMSClient:
#     """Petit wrapper Twilio ; s'active seulement si les variables sont définies."""
#     def __init__(self):
#         self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
#         self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
#         self.from_number = os.getenv("TWILIO_FROM_NUMBER")
#         if all([self.account_sid, self.auth_token, self.from_number]):
#             from twilio.rest import Client
#             self.client = Client(self.account_sid, self.auth_token)
#         else:
#             self.client = None  # SMS désactivé

#     def send_sms(self, to_number: str, body: str) -> str:
#         if not self.client:
#             raise RuntimeError("SMS désactivé : variables Twilio manquantes.")
#         message = self.client.messages.create(
#             body=body, from_=self.from_number, to=to_number
#         )
#         return message.sid

# # --------------------------------------------------------------------------- #
# #  Points d’entrée REST                                                       #
# # --------------------------------------------------------------------------- #

# app = FastAPI(
#     title="DGH Reminder Service",
#     description="Service de composition (et envoi) de rappels multilingues",
#     version="0.1.0",
# )

# svc = ReminderService(TEMPLATES)
# sms_client = SMSClient()

# @app.post("/compose", response_model=ReminderResponse, tags=["reminder"])
# def compose_reminder(req: ReminderRequest):
#     """Génère (et éventuellement envoie) le rappel."""
#     try:
#         message = svc.compose(
#             req.reminder_type,
#             req.language,
#             name=req.name,
#             date=req.date,
#             time=req.time,
#             hospital=req.hospital,
#         )
#     except KeyError as exc:
#         raise HTTPException(status_code=400, detail=str(exc))

#     # Envoi SMS si numéro ET client actifs
#     sent = False
#     sms_sid = None
#     if req.phone_number:
#         try:
#             sms_sid = sms_client.send_sms(req.phone_number, message)
#             sent = True
#         except RuntimeError as exc:
#             # SMS désactivé, mais on ne bloque pas la composition
#             logging.info(f"SMS non envoyé : {exc}")

#     return ReminderResponse(message=message, sent=sent, sms_sid=sms_sid)

# # --------------------------------------------------------------------------- #
# #  Exemple rapide en CLI                                     #
# # --------------------------------------------------------------------------- #

# if __name__ == "__main__":
#     # Simple test local sans FastAPI
#     example = {
#         "reminder_type": "appointment",
#         "language": "EN",
#         "name": "Alice",
#         "date": "18/07/2025",
#         "time": "09:00",
#         "hospital": "Douala General Hospital",
#     }
#     svc_local = ReminderService(TEMPLATES)
#     print(svc_local.compose(**example))
# =======
from  scheduler.celery_app import app
from scheduler.database_service import DBSynchronizer
import asyncio

# Database configurations
SOURCE_DB = {
    "user": "neondb_owner",
    "password": "npg_e4pYGr3ogXQt",
    "database": "neondb",
    "host": "ep-young-sun-ae8uh36n-pooler.c-2.us-east-2.aws.neon.tech"
}

TARGET_DB = {
    "user": "postgres.ihnkhvimonixivwphgnt",
    "password": "VaIC1Hgvm2kCxZYY",
    "database": "postgres",
    "host": "aws-0-eu-north-1.pooler.supabase.com"
}

# @app.task(bind=True)
# def periodic_sync(self):
#     """Main scheduled sync task"""
#     sync = DBSynchronizer()
#     loop = asyncio.get_event_loop()
#     return loop.run_until_complete(_run_sync(sync))

async def _run_sync(sync: DBSynchronizer):
    """Async sync procedure"""
    source_conn = await sync.connect(SOURCE_DB)
    target_conn = await sync.connect(TARGET_DB)
    
    try:
        # Get new feedbacks since last sync
        feedbacks = await source_conn.fetch(
            "SELECT * FROM feedback WHERE submitted_at > $1",
            sync.last_sync
        )
        
        # Process each feedback
        for fb in feedbacks:
            await sync.sync_single_feedback(fb, source_conn, target_conn)
        
        # Update last sync time if successful
        if feedbacks:
            sync.last_sync = max(fb['submitted_at'] for fb in feedbacks)
            return f"Synced {len(feedbacks)} records"
        return "No new feedbacks"
    
    finally:
        await source_conn.close()
        await target_conn.close()
