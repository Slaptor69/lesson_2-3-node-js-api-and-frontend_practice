import { initialBookings, isBookingArray } from '../models/booking.ts'
import type { Booking, NewBooking } from '../models/booking.ts'

const storageKey = 'booking-api-practice:pages'

export function getBookings(): Booking[] {
  const stored = localStorage.getItem(storageKey)
  if (stored === null) return initialBookings()

  const rows: unknown = JSON.parse(stored)
  if (!isBookingArray(rows)) throw new Error('Сохранённый список заявок повреждён.')
  return rows
}

export function createBooking(input: NewBooking): Booking {
  const rows = getBookings()
  const created: Booking = { ...input, id: crypto.randomUUID(), status: 'new', source: 'web' }
  rows.push(created)
  localStorage.setItem(storageKey, JSON.stringify(rows))
  return created
}

export function confirmBooking(id: string): Booking {
  const rows = getBookings()
  const index = rows.findIndex(row => row.id === id)
  if (index < 0) throw new Error('Заявка не найдена.')
  if (rows[index].status === 'confirmed') return rows[index]

  const updated: Booking = { ...rows[index], status: 'confirmed' }
  rows[index] = updated
  localStorage.setItem(storageKey, JSON.stringify(rows))
  return updated
}
