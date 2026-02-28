import { Component, OnInit, inject } from '@angular/core';
import {CurrencyPipe, DatePipe, NgForOf} from "@angular/common";
import {OrderApIsService} from "../../../services/services/order-ap-is.service";
import {OrderResponse} from "../../../services/models/order-response";
import {Product} from "../../../services/models/product";

@Component({
  selector: 'app-orders-report',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './orders-report.component.html',
  styleUrl: './orders-report.component.css'
})
export class OrdersReportComponent implements OnInit{
  private orderService = inject(OrderApIsService);


  orders: OrderResponse[] = [];

  ngOnInit(){
    this.orderService.findAll().subscribe(
      (orders) => {
        this.orders = orders;
      },
      (error) =>{
        console.log("Error fetching orders",error)
      }
    )
  }

  async downloadCSV() {
  const Papa = await import('papaparse');

  const csv = Papa.unparse(
    this.orders.map(order => ({
      'Date': order.localDateTime ? new Date(order.localDateTime).toLocaleDateString() : '',
      'Order ID': order.orderId,
      'Customer': order.customers?.name,
      'Items': order.products?.map(product => product.name).join(', '),
      'Payment': order.paymentMethod,
      'Total': order.totalAmount,
      'Status': order.reference,
      'Order Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
      'Modified Date': order.lastModifiedDate ? new Date(order.lastModifiedDate).toLocaleDateString() : ''
    }))
  );

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'orders_report.csv';
  link.click();
}


  // downloadCSV() {
  //   const csv = Papa.unparse(this.orders.map(order => ({
  //     'Date': order.localDateTime ? new Date(order.localDateTime).toLocaleDateString() : '',
  //     'Order ID': order.orderId,
  //     'Customer': order.customers?.name,
  //     'Items': order.products?.map(product => product.name).join(', '),
  //     'Payment': order.paymentMethod,
  //     'Total': order.totalAmount,
  //     'Status': order.reference,
  //     'Order Date': order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
  //     'Modified Date': order.lastModifiedDate ? new Date(order.lastModifiedDate).toLocaleDateString() : ''
  //   })));

  //   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'orders_report.csv');
  //   link.click();
  // }

  async downloadPDF() {
  const { default: jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();

  const tableData = this.orders.map(order => [
    order.localDateTime ? new Date(order.localDateTime).toLocaleDateString() : '',
    order.orderId ?? '',
    order.customers?.name ?? '',
    order.reference ?? '',
    order.products?.map((product: Product) => product.name).join(', ') ?? '',
    order.paymentMethod ?? '',
    order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    order.lastModifiedDate ? new Date(order.lastModifiedDate).toLocaleDateString() : '',
    order.totalAmount ?? 0,
  ]);

  autoTable(doc, {
    head: [[
      'Date',
      'Order ID',
      'Customer Name',
      'Reference',
      'Products',
      'Payment Method',
      'Created At',
      'Last Modified Date',
      'Total Amount'
    ]],
    body: tableData as any,
  });

  doc.save('Order_Report.pdf');
}



  //   // Map the order data to the table format
  //   downloadPDF() {
  //     const doc = new jsPDF(); // Initialize the jsPDF document

  //     // Map the order data to the table format
  //     const tableData = this.orders.map(order => [
  //       order.localDateTime?new Date(order.localDateTime).toLocaleDateString():'',
  //       order.orderId ?? '', // Replace undefined with an empty string
  //       order.customers?.name ?? '', // Replace undefined with an empty string
  //       order.reference ?? '', // Replace undefined with an empty string
  //       order.products?.map((product: Product) => product.name).join(', ') ?? '', // Replace undefined with an empty string
  //       order.paymentMethod ?? '', // Replace undefined with an empty string
  //       order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '', // Replace undefined with an empty string
  //       order.lastModifiedDate ? new Date(order.lastModifiedDate).toLocaleDateString() : '', // Replace undefined with an empty string
  //       order.totalAmount ?? 0, // Replace undefined with 0
  //     ]);

  //     // Create the table in the PDF using autoTable
  //     autoTable(doc, {
  //       head: [
  //         ['Date', 'Order ID', 'Customer Name', 'Reference', 'Payment Method', 'Created At', 'Last Modified Date', 'Total Amount']
  //       ],
  //       body: tableData as any, // Type-cast to ensure the type matches
  //     });

  //     // Save the document with the name "Order Report"
  //     doc.save('Order_Report.pdf');
  //   }

  // // Method to join product names
  // // getProductNames(order: OrderResponse): string {
  // //   return order.products?.map(product => product.name).join(', ') ?? '';
  // // }


  }
