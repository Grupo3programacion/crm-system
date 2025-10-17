//src/lib/data-store.ts

const STORAGE_KEYS = {
  CLIENTS: "crm_clients",
  PROPOSALS: "crm_proposals",
  CONTRACTS: "crm_contracts",
  ACTIVITIES: "crm_activities",
}

// Helper to safely access localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Clients
export const getClients = (): Client[] => {
  return getFromStorage(STORAGE_KEYS.CLIENTS, [])
}

export const saveClients = (clients: Client[]): void => {
  saveToStorage(STORAGE_KEYS.CLIENTS, clients)
}

export const addClient = (client: Client): void => {
  const clients = getClients()
  saveClients([...clients, client])
}

export const updateClient = (id: string, updates: Partial<Client>): void => {
  const clients = getClients()
  const updated = clients.map(c => c.id === id ? { ...c, ...updates } : c)
  saveClients(updated)
}

export const deleteClient = (id: string): void => {
  const clients = getClients()
  saveClients(clients.filter(c => c.id !== id))
}

// Proposals
export const getProposals = (): Proposal[] => {
  return getFromStorage(STORAGE_KEYS.PROPOSALS, [])
}

export const saveProposals = (proposals: Proposal[]): void => {
  saveToStorage(STORAGE_KEYS.PROPOSALS, proposals)
}

export const addProposal = (proposal: Proposal): void => {
  const proposalsList = getProposals()
  saveToStorage(STORAGE_KEYS.PROPOSALS, [proposal, ...proposalsList].slice(0, 100))
}

export const updateProposal = (id: string, updates: Partial<Proposal>): void => {
  const proposalsList = getProposals()
  const updatedList = proposalsList.map(p => p.id === id ? { ...p, ...updates } : p)
  saveToStorage(STORAGE_KEYS.PROPOSALS, updatedList)
}

export const deleteProposal = (id: string): void => {
  const proposalsList = getProposals()
  saveToStorage(STORAGE_KEYS.PROPOSALS, proposalsList.filter(p => p.id !== id))
}

// Contracts
export const getContracts = (): Contract[] => {
  return getFromStorage(STORAGE_KEYS.CONTRACTS, [])
}

export const saveContracts = (contracts: Contract[]): void => {
  saveToStorage(STORAGE_KEYS.CONTRACTS, contracts)
}

export const addContract = (contract: Contract): void => {
  const contractsList = getContracts()
  saveContracts([...contractsList, contract])
}

export const updateContract = (id: string, updates: Partial<Contract>): void => {
  const contractsList = getContracts()
  const updatedList = contractsList.map(c => c.id === id ? { ...c, ...updates } : c)
  saveContracts(updatedList)
}

export const deleteContract = (id: string): void => {
  const contractsList = getContracts()
  saveContracts(contractsList.filter(c => c.id !== id))
}

// Activities
export const getActivities = (): Activity[] => {
  return getFromStorage(STORAGE_KEYS.ACTIVITIES, [])
}

export const addActivity = (activity: Activity): void => {
  const activitiesList = getActivities()
  saveToStorage(STORAGE_KEYS.ACTIVITIES, [activity, ...activitiesList].slice(0, 100))
}

export const updateActivity = (id: string, updates: Partial<Activity>): void => {
  const activitiesList = getActivities()
  const updatedList = activitiesList.map(a => a.id === id ? { ...a, ...updates } : a)
  saveToStorage(STORAGE_KEYS.ACTIVITIES, updatedList)
}

export const deleteActivity = (id: string): void => {
  const activitiesList = getActivities()
  saveToStorage(STORAGE_KEYS.ACTIVITIES, activitiesList.filter(a => a.id !== id))
}
