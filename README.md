# Brújula · Visión de servicio — v2

Prototipo independiente en HTML, CSS y JavaScript, con datos y nombres ficticios. Nueva implementación y arquitectura visual; no modifica la versión anterior Contexto · Laboratorio de señales. No es una instalación de Grafana ni un dashboard JSON importable.

## Preguntas que explora

1. ¿Cómo se percibe el servicio en las acciones observadas?
2. ¿Cuándo cambió la respuesta y cuántas muestras lo sustentan?
3. ¿Dónde conviene profundizar y qué relación está por validar?
4. ¿Qué evidencia falta para aceptar la recuperación funcional?

Estas preguntas orientan el diseño y requieren validación del responsable. No son una especificación contractual ni una promesa de diagnóstico automático.

## Recorrido

- Panorama visual: experiencia, mapa del servicio y evolución. Las tablas sólo aparecen como soporte desplegable en Evidencias.
- Los nodos y tramos abren detalle modal sin salir del contexto, alterar filtros ni desplazar el origen. Cerrar/Escape restaura el foco.
- Servicio, ventana y escenarios cambian las muestras y los resultados. La URL conserva selección y vista; navegación Atrás funciona entre vistas.
- Experiencia recalcula Apdex desde muestras al modificar T. P95 se calcula sobre las muestras completas de la ventana, no como promedio de percentiles.
- Sin telemetría muestra estado indeterminado, no un indicador saludable. No se calcula Apdex con denominador cero.
- La recuperación técnica conserva pendiente la validación funcional. No se deduce éxito de una operación a partir de HTTP, latencia o un recurso.
- Exportación CSV de todas las muestras ficticias de la selección. Ayuda breve al primer detalle, descartable y sin activaciones repetidas.

## Correspondencia real con Grafana

Canvas permite elementos vinculados a datos y data links; Stat/Bar gauge/Time series representan métricas; State timeline presenta estados temporales; variables y enlaces conservan el contexto. La topología requiere relaciones verificadas. Los modales, escenarios y laboratorio son propios de este HTML: en Grafana su equivalente requiere configurar consultas, paneles y dashboards enlazados. No se promete un modal nativo idéntico.

Grafana no reemplaza RUM, trazas, Session Replay ni la instrumentación funcional ausente. Confirmar edición y versión instaladas, fuentes, etiquetas, cobertura, autenticación y alcance antes de comprometer funcionalidades. El plugin oficial Dynatrace tiene requisitos de Grafana Cloud/Enterprise que deben comprobarse; no se presupone habilitado en OSS autogestionado. No hay llamadas a servicios reales, tokens ni acciones operativas.

## Apdex

Modelo de esta simulación: satisfecha ≤ T; tolerada > T y ≤ 4T; frustrada > 4T o con error. Índice = (satisfechas + 0,5 × toleradas) / total. No es un porcentaje de disponibilidad ni una encuesta de satisfacción. Los umbrales reales y tratamiento de errores deben comprobarse en la fuente según tipo de acción. Colores ilustrativos independientes por señal: Apdex ≥ 0,94 verde, 0,80–0,94 ámbar y < 0,80 rojo; p95 ≤ 1 s verde, > 1 y ≤ 4 s ámbar y > 4 s rojo. Los colores no constituyen una política de severidades o SLA. Cambiar T no modifica el p95.

## Documentación oficial consultada

- [Especificación Apdex](https://www.apdex.org/wp-content/uploads/2020/09/ApdexTechnicalSpecificationV11_000.pdf)
- [Dynatrace: umbrales para acciones XHR](https://docs.dynatrace.com/docs/dynatrace-api/environment-api/settings/schemas/builtin-rum-web-key-performance-metric-xhr-actions)
- [Grafana Canvas](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/canvas/)
- [Grafana data links](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-data-links/)
- [Grafana State timeline](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/state-timeline/)
- [Grafana Inspect → Data](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/panel-inspector/)
- [Requisitos del plugin Dynatrace](https://grafana.com/docs/plugins/grafana-dynatrace-datasource/latest/configure/)

## Abrir

Abrir index.html directamente o servir esta carpeta con un servidor HTTP estático local. No requiere dependencias, instalación, claves ni datos externos. Los enlaces de documentación sí abren fuentes oficiales.

Copyright © 2026 proglopez. Material original de referencia, derechos reservados según LICENSE. La publicación no concede una licencia de código abierto ni atribuye derechos sobre marcas y materiales ajenos.
