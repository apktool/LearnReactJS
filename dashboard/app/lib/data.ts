import {unstable_noStore as noStore} from 'next/cache';
import {exec} from "@/app/lib/sqlite_util";
import {CustomerField, InvoiceForm, InvoicesTable, LatestInvoiceRaw, Revenue} from "@/app/lib/definitions";
import {formatCurrency} from "@/app/lib/utils";
import * as console from "console";

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
    noStore();
    try {
        const result = await exec('SELECT * FROM revenue');
        // console.debug('Data fetch completed after 3 seconds.');
        return result as Revenue[]
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch revenue data.');
    }
}

export async function fetchLatestInvoices() {
    noStore();
    try {
        const result = await exec(`
            SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
            FROM invoices
                     JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5`);

        const data = result as LatestInvoiceRaw[]

        const latestInvoices = data.map((invoice) => ({
            ...invoice,
            amount: formatCurrency(invoice.amount),
        }));
        return latestInvoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchCardData() {
    noStore();
    try {
        const invoiceCountPromise = exec('SELECT COUNT(*) FROM invoices');
        const customerCountPromise = exec('SELECT COUNT(*) FROM customers');
        const invoiceStatusPromise = exec(`
            SELECT SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)    AS "paid",
                   SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices`);

        const data = await Promise.all([
            invoiceCountPromise,
            customerCountPromise,
            invoiceStatusPromise,
        ]);


        const numberOfInvoices = Number(data[0][0].count ?? '0');
        const numberOfCustomers = Number(data[1][0].count ?? '0');
        const totalPaidInvoices = formatCurrency(data[2][0].paid ?? '0');
        const totalPendingInvoices = formatCurrency(data[2][0].pending ?? '0');

        return {
            numberOfCustomers,
            numberOfInvoices,
            totalPaidInvoices,
            totalPendingInvoices,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}
;

export async function fetchFilteredCustomers(query: string) {
    noStore();
    try {
        const data = await exec(`
            SELECT customers.id,
                   customers.name,
                   customers.email,
                   customers.image_url,
                   COUNT(invoices.id)                                                         AS total_invoices,
                   SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                   SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END)    AS total_paid
            FROM customers
                     LEFT JOIN invoices ON customers.id = invoices.customer_id
            WHERE customers.name LIKE ${`'%${query}%'`}
               OR customers.email LIKE ${`'%${query}%'`}
            GROUP BY customers.id, customers.name, customers.email, customers.image_url
            ORDER BY customers.name ASC
        `);

        const customers = data.map((customer) => ({
            ...customer,
            total_pending: formatCurrency(customer.total_pending),
            total_paid: formatCurrency(customer.total_paid),
        }));

        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}

export async function fetchInvoiceById(id: string) {
    noStore();
    try {
        const data = await exec(`
            SELECT invoices.id,
                   invoices.customer_id,
                   invoices.amount,
                   invoices.status
            FROM invoices
            WHERE invoices.id = '${id}';
        `);

        const invoice = data.map((invoice) => ({
            ...invoice,
            // Convert amount from cents to dollars
            amount: invoice.amount / 100,
        }));

        return invoice[0] as InvoiceForm;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');
    }
}

export async function fetchInvoicesPages(query: string) {
    noStore();
    try {
        const count = await exec(`SELECT COUNT(*)
                                  FROM invoices
                                           JOIN customers ON invoices.customer_id = customers.id
                                  WHERE customers.name LIKE ${`'%${query}%'`}
                                     OR customers.email LIKE ${`'%${query}%'`}
                                     OR invoices.amount LIKE ${`'%${query}%'`}
                                     OR invoices.date LIKE ${`'%${query}%'`}
                                     OR invoices.status LIKE ${`'%${query}%'`}
        `);

        const totalPages = Math.ceil(Number(count[0]["COUNT(*)"]) / ITEMS_PER_PAGE);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function fetchCustomers() {
    try {
        const data = await exec(`
            SELECT id,
                   name
            FROM customers
            ORDER BY name ASC
        `);

        const customers: CustomerField[] = data;
        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredInvoices(
    query: string,
    currentPage: number,
) {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const invoices = await exec(`
            SELECT invoices.id,
                   invoices.amount,
                   invoices.date,
                   invoices.status,
                   customers.name,
                   customers.email,
                   customers.image_url
            FROM invoices
                     JOIN customers ON invoices.customer_id = customers.id
            WHERE customers.name LIKE ${`'%${query}%'`}
               OR customers.email LIKE ${`'%${query}%'`}
               OR invoices.amount LIKE ${`'%${query}%'`}
               OR invoices.date LIKE ${`'%${query}%'`}
               OR invoices.status LIKE ${`'%${query}%'`}
            ORDER BY invoices.date DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `);

        return invoices as InvoicesTable[];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}


export const formatDateToLocal = (dateStr: string, locale: string = 'en-US',) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
    const yAxisLabels = [];
    const highestRecord = Math.max(...revenue.map((month) => month.revenue));
    const topLabel = Math.ceil(highestRecord / 1000) * 1000;

    for (let i = topLabel; i >= 0; i -= 1000) {
        yAxisLabels.push(`$${i / 1000}K`);
    }

    return {yAxisLabels, topLabel};
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ];
}