"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, CheckCircle, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: string; // number in string from Decimal
  tax: string;
  total: string;
  status: string;
  auditoria?: {
    fiscalYear: number;
    tipoServicio: string;
  };
}

export default function EmpresaFacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      const res = await fetch('/api/empresa/invoices');
      console.log("RESPONNSEEE**********", res);
      const data = await res.json();
      if (data.success) {
          setInvoices(data.data.items);
      } else {
        console.error("Error fetching invoices:", data.error);
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    const serviceName = invoice.auditoria?.tipoServicio?.replace(/_/g, ' ') || 'Servicios de Auditoría';
    const invoiceDate = new Date(invoice.date).toLocaleDateString();

    // -- Header --
    // Logo placeholder (Using text for now, could insert image with doc.addImage)
    doc.setFontSize(22);
    doc.setTextColor(33, 44, 55); // Dark Slate
    doc.text("MindAudit", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Plataforma de Auditoría Digital", 14, 26);

    // -- Invoice Info --
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("FACTURA", 140, 20);
    
    doc.setFontSize(10);
    doc.text(`N° Factura: ${invoice.number}`, 140, 28);
    doc.text(`Fecha: ${invoiceDate}`, 140, 34);

    // -- Client Info (Mock for now, normally fetched from profile) --
    // doc.text("Cliente: [Nombre Empresa]", 14, 50); 
    
    // -- Line Items --
    autoTable(doc, {
      startY: 55,
      head: [['Concepto', 'Base Imponible', 'IVA (21%)', 'Total']],
      body: [
        [
            `Auditoría ${invoice.auditoria?.fiscalYear || ''} - ${serviceName}`, 
            formatCurrency(Number(invoice.amount)), 
            formatCurrency(Number(invoice.tax)), 
            formatCurrency(Number(invoice.total))
        ],
      ],
      headStyles: { fillColor: [16, 185, 129] }, // Emerald-600 logic
      styles: { fontSize: 10, cellPadding: 4 },
    });

    // -- Footer --
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.text("Gracias por confiar en MindAudit.", 14, finalY);

    // Save
    doc.save(`Factura_MindAudit_${invoice.number}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturación</h1>
        <p className="text-slate-500 mt-1">
          Historial de facturas disponibles para descarga.
        </p>
      </div>

      <Card className="shadow-sm border-slate-100">
        <CardHeader>
          <CardTitle>Mis Facturas</CardTitle>
          <CardDescription>
             Listado de sus facturas emitidas por MindAudit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
                {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
             </div>
          ) : invoices.length === 0 ? (
             <div className="text-center py-12 text-slate-500">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                   <FileText className="h-6 w-6 text-slate-400" />
                </div>
                <p>No hay facturas disponibles aún.</p>
             </div>
          ) : (
             <div className="rounded-md border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                         <th className="px-4 py-3">Número</th>
                         <th className="px-4 py-3">Fecha</th>
                         <th className="px-4 py-3">Concepto</th>
                         <th className="px-4 py-3">Importe</th>
                         <th className="px-4 py-3">Estado</th>
                         <th className="px-4 py-3 text-right">Descargar</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {invoices.map((inv) => (
                         <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                               {inv.number}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                               {new Date(inv.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                               <span className="font-medium text-slate-900 block">
                                  {inv.auditoria?.tipoServicio?.replace(/_/g, " ") || 'Servicios Varios'}
                               </span>
                               {inv.auditoria && (
                                   <span className="text-xs text-slate-400 font-mono">
                                      Ejercicio {inv.auditoria.fiscalYear}
                                   </span>
                               )}
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-900">
                               {formatCurrency(Number(inv.total))}
                            </td>
                             <td className="px-4 py-3">
                                {inv.status === 'PAID' ? (
                                   <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                                      <CheckCircle className="h-3 w-3" /> Pagada
                                   </Badge>
                                ) : (
                                   <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
                                      <Clock className="h-3 w-3" /> Pendiente
                                   </Badge>
                                )}
                             </td>
                            <td className="px-4 py-3 text-right">
                               <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  onClick={() => generatePDF(inv)}
                               >
                                  <Download className="h-4 w-4" />
                                  PDF
                               </Button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
