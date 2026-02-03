export interface Root {
  success: boolean
  message: string
  data: Data
}

export interface Data {
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

export default function DashboardCustomer() {
    return(
        <div>
            Dashboard Customer
        </div>
    )
}

