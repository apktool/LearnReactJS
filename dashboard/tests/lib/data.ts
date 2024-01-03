import {
    fetchCardData,
    fetchFilteredCustomers,
    fetchFilteredInvoices, fetchInvoiceById,
    fetchInvoicesPages,
    fetchLatestInvoices,
    fetchRevenue,
    formatDateToLocal,
    generatePagination,
    generateYAxis
} from "@/app/lib/data";
import {Revenue} from "@/app/lib/definitions";
import expect from "expect";

describe("#fetch", () => {
    it("fetchRevenue", async () => {
        const res: Revenue[] = await fetchRevenue()
        expect(res.length > 0).toBeTruthy()
    })

    it("fetchLatestInvoices", async () => {
        const res = await fetchLatestInvoices()
        expect(res.length > 0).toBeTruthy()
    })

    it("fetchCardData", async () => {
        const res = await fetchCardData()
        expect(res.numberOfCustomers).toEqual(0)
        expect(res.numberOfInvoices).toEqual(0)
        expect(res.totalPaidInvoices).toEqual('$1,185.16')
        expect(res.totalPendingInvoices).toEqual('$1,256.32')
    })

    it("fetchFilteredCustomers", async () => {
        const res = await fetchFilteredCustomers('')
        expect(res.length > 0).toBeTruthy()
    })

    it("fetchInvoiceById", async () => {
        const res = await fetchInvoiceById("3958dc9e-712f-4377-85e9-fec4b6a6442a1")
        expect(res.customer_id).toEqual("3958dc9e-712f-4377-85e9-fec4b6a6442a")
    })

    it("fetchInvoicesPages", async () => {
        const res = await fetchInvoicesPages('')
        expect(res).toEqual(3)
    })

    it("fetchFilteredInvoices", async () => {
        const res = await fetchFilteredInvoices('', 0)
        expect(res.length > 0).toBeTruthy()
    })
})

describe("#format", () => {
    it("formatDateToLocal", () => {
        const res = formatDateToLocal("2022-12-06")
        expect(res).toEqual("Dec 6, 2022")
    })
})

describe("#generate", () => {
    it("generateYAxis", () => {
        const revenue = {month: "Jan", revenue: 2000}
        const res = generateYAxis([revenue as Revenue])
        expect(res.topLabel).toEqual(2000)
    })

    it("generatePagination", () => {
        const res = generatePagination(1, 5)
        expect(res).toEqual([1, 2, 3, 4, 5])
    })

})