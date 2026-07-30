import os
import uuid

class LocalStorageAdapter:
    def __init__(self, upload_dir: str = None):
        if upload_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            upload_dir = os.path.join(base_dir, "uploads")
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def upload_file(self, file_bytes: bytes, file_name: str, content_type: str) -> str:
        os.makedirs(self.upload_dir, exist_ok=True)
        unique_name = f"{uuid.uuid4().hex[:8]}_{file_name}"
        file_path = os.path.join(self.upload_dir, unique_name)
        with open(file_path, "wb") as f:
            f.write(file_bytes)
        return file_path
