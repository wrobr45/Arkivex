export type SecurityLevel = "Public" | "Internal" | "Confidential" | "Restricted";

export type ApprovalStatus = "Draft" | "Pending Manager" | "Pending Legal" | "Pending Owner" | "Published" | "Approved" | "Rejected";

export type StorageProvider = "Cloudflare R2" | "AWS S3" | "MinIO Self-Hosted" | "MinIO" | "Google Cloud Storage" | "Supabase Cloud Storage" | "Local Disk" | string;

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  user_email?: string;
  owner: string;
  department: string;
  securityLevel: SecurityLevel;
  storageProvider: StorageProvider;
  storagePath?: string;
  fileSize: string;
  fileType: string;
  updatedAt: string;
  expiryDate?: string | null;
  status: "Active" | "Expiring Soon" | "Archived" | "Pending Approval" | string;
  aiSummary: string;
  ocrText: string;
  tags: string[];
  version: string;
  checksum: string;
  approvalStatus: ApprovalStatus;
  isLocked?: boolean;
  securityPin?: string;
  relatedFilesCount?: number;
  commentsCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Owner" | "Admin" | "Manager" | "Finance" | "HR" | "Legal" | "Employee" | "Guest" | "Auditor";
  department: string;
  mfaEnabled: boolean;
}

export interface CategoryStructure {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  docCount: number;
}

export interface ApprovalTask {
  id: string;
  documentId?: string;
  documentTitle: string;
  requester: string;
  category: string;
  stage: string;
  requestedDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected";
}

export interface StorageStats {
  provider: string;
  type: string;
  usedGB: number;
  totalGB: number;
  status: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  securityLevel?: string;
}
