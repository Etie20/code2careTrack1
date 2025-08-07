export type Filters = {
    bloodTypes: string[]
    status: string
    location: string
    urgency: string
    hospital: string
    quantity: {
        min: string
        max: string
    }
}
