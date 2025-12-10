'use client'

import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { Check, CheckCircle, CircleX, TriangleAlert } from "lucide-react"

export type Email = {
    email: string
    status: string
    created_at: Date
}

export const columns: ColumnDef<Email>[] = [
    {
        accessorKey: 'email',
        header: 'Email',
    },
     {
        accessorKey:'status',
        header: 'Status',
        cell: ({row}) => {
            const status = row.getValue('status')

            return(
                <p className={`${status === 'Enviado' ? 'text-green-500':'text-red-500'}`}>{status === 'Enviado' ? <Check/>  : <CircleX/>}</p>
            )
        }
    },
     {
        accessorKey: 'created_at',
        header: 'Data',
        cell: ({row}) => {
            const formatedDate = dayjs(row.getValue('created_at')).format('DD/MM/YYYY HH:mm')

            return(
                <p>{formatedDate}</p>
            )
        }

    },
]