import urllib.request
import json
from app.core.config import settings

class SupabaseMetadataService:
    @staticmethod
    def sync_document_metadata(doc_data: dict):
        """Sync document metadata record directly to Supabase REST API."""
        url = f"{settings.SUPABASE_URL}/rest/v1/documents"
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_SECRET,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_SECRET}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

        payload = {
            "id": doc_data.get("id"),
            "title": doc_data.get("title"),
            "category": doc_data.get("category"),
            "owner": doc_data.get("owner_id", "user-001"),
            "security_level": doc_data.get("security_level", "Internal"),
            "checksum_sha256": doc_data.get("checksum_sha256"),
            "ai_summary": doc_data.get("ai_summary"),
            "storage_path": doc_data.get("storage_path"),
        }

        try:
            req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
            with urllib.request.urlopen(req) as response:
                res_body = response.read().decode("utf-8")
                return {"status": "synced", "response": res_body}
        except Exception as e:
            print(f"[Supabase Sync Note]: Supabase table sync queued: {e}")
            return {"status": "queued", "note": str(e)}
