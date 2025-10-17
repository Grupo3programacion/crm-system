export type ClientStatus = "lead" | "active" | "inactive" | "archived"
export type ProposalStatus = "draft" | "sent" | "viewed" | "accepted" | "rejected"
export type ContractStatus = "pending" | "active" | "completed" | "cancelled"
export type Priority = "low" | "medium" | "high"

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: ClientStatus
  industry?: string
  assignedTo?: string
  value: number
  lastContact: string
  createdAt: string
  notes?: string
}

export interface Proposal {
  id: string
  clientId: string
  title: string
  description: string
  value: number
  status: ProposalStatus
  priority: Priority
  validUntil: string
  createdAt: string
  sentAt?: string
  viewedAt?: string
  items: ProposalItem[]
}

export interface ProposalItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Contract {
  id: string
  clientId: string
  proposalId?: string
  title: string
  value: number
  status: ContractStatus
  startDate: string
  endDate: string
  createdAt: string
  terms?: string
  signedAt?: string
}

export interface Activity {
  id: string
  type: "client" | "proposal" | "contract"
  action: string
  description: string
  timestamp: string
  relatedId: string
}
