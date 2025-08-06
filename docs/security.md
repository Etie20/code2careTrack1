# Security Notes

- All requests must include the `X-API-Key` header.
- Conversation history is kept in memory only and can be deleted with `DELETE /history/{user_id}`.
- No personal data is persisted to disk to help comply with GDPR principles of minimization. 
- TLS/SSL should be enabled at the reverse proxy level. The application includes
  an HTTPS redirect middleware to enforce HTTPS usage.
- Incoming payloads are validated with Pydantic models to avoid malformed or
  malicious data.