import React from 'react';

interface Props {
  venta: {
    cliente: { nombre: string; cedula: string };
    productos: any[];
    total: number;
    subtotal: number;
    iva: number;
  };
}

export const TicketVenta = React.forwardRef<HTMLDivElement, Props>(({ venta }, ref) => {
  return (
    <div ref={ref} style={{ 
      width: '58mm', 
      padding: '0', // Eliminamos padding para ganar espacio
      backgroundColor: 'white', 
      color: 'black',
      fontFamily: 'monospace',
      lineHeight: '1.1' // Líneas más juntas para ahorrar papel
    }}>
      <style>
        {`
          @media print {
            @page { 
                margin: 0; 
                size: 58mm auto; /* CLAVE: Ajusta el largo al contenido */
            }
            body { 
                margin: 0; 
                -webkit-print-color-adjust: exact;
            }
          }
          .dashed-line {
            border-top: 2px dotted black; /* Línea más gruesa y visible */
            margin: 4px 0;
            width: 100%;
          }
        `}
      </style>
      
      {/* ENCABEZADO - Letra más grande y negrita */}
      <div style={{ textAlign: 'center', padding: '0 2mm' }}>
        <h1 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>JEANS STORE</h1>
        <p style={{ fontSize: '12px', margin: '2px 0', fontWeight: 'bold' }}>RUC: 0106839816001</p>
        <p style={{ fontSize: '11px', margin: '0' }}>Cuenca, Ecuador</p>
        <div className="dashed-line"></div>
      </div>

      {/* INFO CLIENTE - Letra aumentada a 12px */}
      <div style={{ fontSize: '12px', padding: '0 2mm' }}>
        <p style={{ margin: '3px 0' }}><b>FECHA:</b> {new Date().toLocaleDateString()}</p>
        <p style={{ margin: '3px 0' }}><b>HORA:</b> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <p style={{ margin: '3px 0' }}><b>CLIENTE:</b> {venta.cliente.nombre.toUpperCase()}</p>
        <p style={{ margin: '3px 0' }}><b>C.I./RUC:</b> {venta.cliente.cedula}</p>
        <div className="dashed-line"></div>
      </div>

      {/* DETALLE PRODUCTOS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid black' }}>
            <th align="left">DESC</th>
            <th align="center">CANT</th>
            <th align="right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {venta.productos.map((p, i) => (
            <React.Fragment key={i}>
              <tr>
                <td colSpan={3} style={{ paddingTop: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                  {p.nombre.toUpperCase()}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td align="left">Precio: ${p.precio.toFixed(2)}</td>
                <td align="center">x{p.cantidad}</td>
                <td align="right">${(p.precio * p.cantidad).toFixed(2)}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="dashed-line"></div>

      {/* TOTALES - Muy destacados */}
      <div style={{ fontSize: '13px', padding: '0 2mm' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>SUBTOTAL:</span>
          <span>${venta.subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>IVA 15%:</span>
          <span>${venta.iva.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'black', marginTop: '5px', borderTop: '1px solid black' }}>
          <span>TOTAL:</span>
          <span>${venta.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="dashed-line"></div>

      {/* PIE DE PÁGINA COMPACTO */}
      <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '5px', paddingBottom: '5mm' }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>¡GRACIAS POR SU COMPRA!</p>
        <p style={{ margin: '2px 0' }}>Revise su mercadería.</p>
        <p style={{ margin: '0' }}>@JeansStore</p>
      </div>
    </div>
  );
});