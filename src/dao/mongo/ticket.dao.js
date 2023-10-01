import ticketModel  from "./models/ticket.model.js"

export class TicketMongoDao {
    async getTickets() {
        return await ticketModel.find({})
    }

    async getTicketById(tid) {
        return ticketModel.findById(tid)
    }

    async saveTicket(ticket) {
        return await ticketModel.create(ticket)
    }
}