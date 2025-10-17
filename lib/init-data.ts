"use client"

import { getClients, saveClients, getProposals, saveProposals, getContracts, saveContracts } from "./data-store"
import { mockClients, mockProposals, mockContracts } from "./mock-data"

export const initializeData = () => {
  // Only initialize if no data exists
  if (getClients().length === 0) {
    saveClients(mockClients)
  }
  if (getProposals().length === 0) {
    saveProposals(mockProposals)
  }
  if (getContracts().length === 0) {
    saveContracts(mockContracts)
  }
}
