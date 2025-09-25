import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import archiver from 'archiver';
import AdminJS, { ActionRequest, ActionResponse, ActionContext } from 'adminjs';
import { Order } from '../models/order.model.js';
import { OrderItem } from '../models/order-item.model.js';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { Modeling } from '../models/modeling.model.js';
import { PassThrough } from 'stream';
import { Response } from 'express';




const exportDir = path.resolve('public/exports');
if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

// Mapeamento de cores hex para nomes

function generatePDF(order: Order, outputPath: string): Promise<void> {
  return new Promise((resolve) => {
    console.log('Email no PDF:', order.recipientEmail);
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(16).text(`PEDIDO #${order.id}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(12).text(`Cliente: ${order.user?.name || '---'}`);
    doc.moveDown(1);

    for (const item of order.items) {
      const nomeProduto = item.product?.name || '---';
      const modelName = item.model || '---';
      const cor = item.color || '---';
      const tam = item.size || '---';
      const obs = item.obs || '---';
      const qtd = item.quantity || 1;

      const imgPath = item.imagePath
        ? path.resolve('public' + (item.imagePath.startsWith('/') ? '' : '/') + item.imagePath)
        : null;

      // ORDEM ORIGINAL PRESERVADA
      doc
        .fontSize(12)
        .text(`COD.: ${nomeProduto}`)
        .text(`MODELO: ${modelName}`)
        .text(`COR.: ${cor}`)
        .text(`TAM.: ${tam}`)
        .text(`QTD.: ${qtd}`)
        .text(`OBS.: ${obs}`)
        .moveDown(0.5);

      if (imgPath && fs.existsSync(imgPath)) {
        try {
          doc.image(imgPath, { width: 120, height: 120 });
        } catch {
          doc.text('[Erro ao carregar imagem]');
        }
        doc.moveDown();
      }

      doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
      doc.moveDown(1);
    }

    // BLOCO FINAL
    doc
      .fontSize(12)
      .text(`Frete: ${order.freight > 0 ? 'Sim' : 'Não'}`)
      .text(`CEP para cálculo do frete: ${order.recipientCEP || '---'}`)
      .text(`Nome do destinatário: ${order.recipientName || '---'}`)
      .text(`CPF do destinatário: ${order.recipientCPF || '---'}`)
      .text(`Endereço de envio: ${order.shippingAddress || '---'}`)
      .moveDown(1)
      .text(`Email do destinatário: ${order.recipientEmail || '---'}`);
    doc.end();
    stream.on('finish', resolve);
  });
}


export const exportOrderPdf = {
  actionType: 'record',
  name: 'export_pdf',
  label: 'Exportar PDF',
  icon: 'DocumentSearch',
  component: AdminJS.bundle('./components/OpenPdf.tsx'),
  handler: async (
    _request: ActionRequest,
    _response: Response,
    context: ActionContext
  ) => {
    const { record } = context;
    if (!record || !record.params.id) {
      throw new Error('ID do pedido não encontrado.');
    }
    const order = await Order.findByPk(record.params.id, {
      include: [
        { model: OrderItem, include: [{ model: Product, include: [Modeling] }] },
        { model: User },
      ],
    });

    if (!order) throw new Error('Pedido não encontrado.');
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = new PassThrough();
    doc.pipe(stream);

    // Conteúdo do PDF
    doc.fontSize(16).text(`PEDIDO #${order.id}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(12).text(`Cliente: ${order.user?.name || '---'}`);
    doc.moveDown(1);

    for (const item of order.items) {
      const nomeProduto = item.product?.name || '---';
      const modelName = item.model || '---';
      const cor = item.color || '---';
      const tam = item.size || '---';
      const obs = item.obs || '---';
      const qtd = item.quantity || 1;

      doc
        .fontSize(12)
        .text(`COD.: ${nomeProduto}`)
        .text(`MODELO: ${modelName}`)
        .text(`COR.: ${cor}`)
        .text(`TAM.: ${tam}`)
        .text(`QTD.: ${qtd}`)
        .text(`OBS.: ${obs}`)
        .moveDown(0.5);

      doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
      doc.moveDown(1);
    }

    doc
      .fontSize(12)
      .text(`Frete: ${order.freight > 0 ? 'Sim' : 'Não'}`)
      .text(`CEP para cálculo do frete: ${order.recipientCEP || '---'}`)
      .text(`Nome do destinatário: ${order.recipientName || '---'}`)
      .text(`CPF do destinatário: ${order.recipientCPF || '---'}`)
      .text(`Endereço de envio: ${order.shippingAddress || '---'}`)
      .text(`Email do destinatário: ${order.recipientEmail || '---'}`);

    doc.end();

    // Captura o conteúdo do stream como Buffer
    const chunks: Buffer[] = [];
    const pdfBuffer: Buffer = await new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    const tempPath = path.join(exportDir, `pedido-${order.id}.pdf`);
    fs.writeFileSync(tempPath, pdfBuffer);

    return {
      record: record.toJSON(),
      notice: { message: 'PDF gerado com sucesso!', type: 'success' },
      redirectUrl: `/exports/pedido-${order.id}.pdf`, // 👈 isso abre o PDF direto no navegador
    };

  },
};


export const exportMultipleOrdersPdf = {
  actionType: 'bulk',
  name: 'export_pdf_zip',
  label: 'Exportar Pedidos (.zip)',
  icon: 'DocumentSearch',
  component: false,
  handler: async (_req: ActionRequest, _res: ActionResponse, context: any) => {
    const { records } = context;
    const zipName = `pedidos-${Date.now()}.zip`;
    const zipPath = path.join(exportDir, zipName);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);

    for (const record of records) {
      const order = await Order.findByPk(record.params.id, {
        include: [
          { model: OrderItem, include: [{ model: Product, include: [Modeling] }] },
          { model: User },
        ],
      });

      if (order) {
        const tempPath = path.join(exportDir, `pedido-${order.id}.pdf`);
        await generatePDF(order, tempPath);
        archive.file(tempPath, { name: `pedido-${order.id}.pdf` });
      }
    }

    await archive.finalize();

    return {
      notice: { message: 'ZIP gerado com sucesso!', type: 'success' },
      file: { name: zipName, path: `/exports/${zipName}` },
    };
  },
};
