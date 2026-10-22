# Contexto · Monitoreo integrado v2

Prototipo independiente en HTML, CSS y JavaScript. Mantiene la centralización de eventos y métricas de Zabbix y Dynatrace como objetivo: reúne 12 señales ficticias —6 de Zabbix y 6 de Dynatrace— relacionadas con 5 servicios ficticios. La entrada visual permite reconocer la prioridad, la fuente y el servicio afectado y profundizar en la evidencia. Las tablas quedan como detalle secundario.

Interfaz clara, sin dependencias ni conexión con entornos reales. Permite explorar un recorrido operativo realizable con funciones de Grafana. No es una instalación de Grafana ni un dashboard importable. La versión anterior se conserva por separado.

## Recorrido

1. **Vista integrada:** prioridades, fuentes y servicios se leen visualmente antes de entrar al detalle. Los filtros mantienen el contexto de fuente, servicio, host, severidad y periodo. Un dato agregado no sustituye el estado ni el identificador de la señal original.
2. **Eventos:** señales de Zabbix y Dynatrace con fuente, servicio, host y estado. Las tarjetas abren una vista previa modal por prioridad; desde ella se puede aplicar el filtro. La tabla permite consultar y ordenar el detalle cuando se necesita.
3. **Dashboard de servicio:** la evidencia abre primero un modal sobre la vista actual. El botón Abrir dashboard de servicio realiza el cambio de pantalla y conserva servicio, host y periodo. Reúne evidencia de aplicación e infraestructura y deja visibles el resultado funcional sin medir, la cobertura incompleta y la recuperación por comprobar.
4. **Indicadores:** respuesta p95, recursos, Apdex, errores HTTP, disponibilidad observada y distribución de actividad. Apdex es uno de los indicadores, no el eje que sustituye la centralización. Se representa como un valor ficticio recibido de la fuente; población, cantidad de muestras y umbrales reales quedan por validar. Cuando no hay medición aplicable se presenta su ausencia. Las variables de servicio, recurso y Top ajustan la lectura. La leyenda permite ocultar series.
5. **View e Inspect → Data:** el menú del panel amplía la visualización o muestra los datos que la sustentan. Download CSV descarga los valores ficticios. Las series temporales conservan sus muestras en el inspector.
6. **Registro de señales:** detalle de las fuentes y navegación al contexto de servicio.

Las explicaciones aparecen también al interactuar, una vez por tipo de ayuda durante la carga. El control Ayudas al interactuar permite desactivarlas. Las vistas previas identifican expresamente que el modal es propio del HTML y explican su equivalente en Grafana. Los botones de ayuda mantienen acceso a la documentación.

## Vista previa y orientación

Vista integrada → prioridad → señales → servicio → lectura/gráficas/evidencias se recorre con una vista previa modal, sin cambiar la URL, los filtros ni la posición de la pantalla de origen. El rastro superior muestra cada paso. Cerrar o Escape devuelve al origen; Volver a prioridad permite retroceder dentro del detalle. Los botones de navegación explícitos cambian de vista, con regreso y navegación del navegador.

El modal y las ayudas emergentes son características del HTML. No se afirma que el modal de investigación sea nativo de Grafana.

## Correspondencia con Grafana

| Interacción | Función documentada | Condición |
| --- | --- | --- |
| Tarjeta que filtra prioridad | Stat con un único data link al mismo dashboard | Incluir variable de severidad y periodo. Stat no muestra el interruptor One click; con un solo enlace lo abre directamente. |
| Evolución de métricas | Time series | Consultas con unidad, rango y agregación conocidos. La coincidencia temporal no demuestra causalidad. |
| Recursos o distribución de valores | Bar gauge | Precisar qué representa la barra y sus umbrales. Con un único data link se permite apertura en un clic. |
| Cambios de estado en el tiempo | State timeline | Requiere timestamp, entidad y estado; los huecos y valores nulos no equivalen a normalidad. |
| Relación visual de servicios y activos | Canvas con elementos ligados a datos y data links | Las relaciones y reglas de color deben configurarse y validarse. Un dibujo de dependencias no acredita descubrimiento automático ni causa raíz. |
| Fila que abre contexto | Table con un data link a otro dashboard | Definir claves de servicio y host, UID de destino y variables compatibles. Con varios enlaces aparece un menú. |
| Contexto conservado | Variables de URL `var-nombre`, `from` y `to` | Incluirlos explícitamente. Las rutas `?view=` pertenecen a esta demo; en Grafana se usaría `/d/UID/...`. |
| Cambiar recurso o servicio | Variables de dashboard | Las consultas deben usar las variables. |
| Ampliar o inspeccionar | Menú View e Inspect → Data | Disposición y opciones según versión y panel. |
| Exportar soporte | Download CSV del inspector | Exporta resultados de consulta y transformaciones; aquí exporta datos ficticios. |
| Ocultar una serie | Leyenda en Time series | No cambia la captura de origen. |
| Relacionar fuentes | Consultas y transformaciones con campos compatibles | La coincidencia de host y tiempo no acredita causalidad. |
| Profundizar en el origen | Data link contextual o Explore | Requiere URL, acceso y rol adecuado. El botón de esta demo explica la posibilidad y no abre un sistema real. |

View e Inspect son funciones nativas. Un modal de investigación diseñado a medida no es una función genérica de los data links; la demo ofrece esta vista previa propia del HTML y un cambio explícito a dashboards enlazados, distinguiendo ambas cosas.

## Datos y límites

- Grafana presenta datos de sus fuentes. No completa trazas, RUM o reglas funcionales ausentes.
- Las señales Zabbix y los problemas Dynatrace conservan su origen. Una severidad consolidada requiere una correspondencia explícita y validada; no se equiparan automáticamente las escalas de ambas herramientas.
- Apdex es un índice entre 0 y 1 referido a una población y unos umbrales. No es un porcentaje de disponibilidad ni prueba de éxito funcional. El prototipo no calcula el índice a partir de alertas ni representa una población de acciones: esa cantidad de muestras y sus umbrales deben comprobarse en la fuente. Sin un valor representado se muestra ausencia de medición.
- Una respuesta HTTP correcta no acredita una operación funcional terminada. Se representa la ausencia de medición sin inventar resultados.
- Las prioridades son ejemplos, sin SLA ni política operativa aprobada. La disponibilidad es ilustrativa.
- Las formas de las series son ejemplos normalizados al rango elegido, sin mediciones históricas. La distribución semanal es un ejemplo fijo independiente de los filtros de eventos.
- Estados, recomendaciones y responsabilidades son ilustrativos. La demo no ejecuta consultas, cambios, pruebas de producción ni escalaciones.
- La edición, versión y plugins reales deben verificarse antes de implementar. Los enlaces a documentación vigente son referencia de capacidades y no acreditan su instalación, licencia o disponibilidad en ningún entorno.

El plugin Zabbix es de código abierto, con licencia Apache 2.0. Permite consultar métricas, problemas y triggers, SLA, anotaciones y variables. Requiere API accesible, instalación y habilitación del plugin, y lectura de los grupos y hosts correspondientes. Se debe comprobar la compatibilidad entre la versión elegida del plugin y la de Grafana; esto no acredita que ya esté instalado.

El conector oficial Dynatrace es un Enterprise plugin y admite SaaS, Managed o Environment ActiveGate. Requiere una modalidad de Grafana Cloud compatible o Grafana Enterprise con licencia activada, además de un token Dynatrace con los ámbitos necesarios para cada consulta. La versión mínima del plugin elegido debe comprobarse. No se da por habilitado en Grafana OSS autogestionado. Grail requiere token y permisos adicionales, y no se presume disponible por usar Dynatrace Managed. RUM, trazas y diagnóstico siguen sujetos a la cobertura y condiciones de Dynatrace.

## Abrir en local

Abrir `index.html`, o ejecutar desde esta carpeta:

```text
python -m http.server 8766 --bind 127.0.0.1
```

Ingresar en `http://127.0.0.1:8766/`. No requiere paquetes, API keys ni conexión con sistemas externos. Los enlaces de documentación sí abren páginas oficiales.

## Fuentes oficiales

- [Stat](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/stat/)
- [Time series](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/time-series/)
- [Bar gauge](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/bar-gauge/)
- [State timeline](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/state-timeline/)
- [Canvas](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/canvas/)
- [Table](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/table/)
- [Data links](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-data-links/)
- [Variables en URL](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard-url-variables/)
- [Funciones de panel](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/panel-overview/)
- [Inspector y CSV](https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/panel-inspector/)
- [Explore y roles](https://grafana.com/docs/grafana/latest/visualizations/explore/get-started-with-explore/)
- [Requisitos del conector Dynatrace](https://grafana.com/docs/plugins/grafana-dynatrace-datasource/latest/configure/)
- [Consultas Dynatrace](https://grafana.com/docs/plugins/grafana-dynatrace-datasource/latest/query-editor/)
- [Plugin Zabbix](https://grafana.com/docs/plugins/alexanderzobnin-zabbix-app/latest/)
- [Configuración Zabbix](https://grafana.com/docs/plugins/alexanderzobnin-zabbix-app/latest/configure/)
- [Licencia del plugin Zabbix](https://github.com/grafana/grafana-zabbix/blob/main/LICENSE)
- [Dynatrace RUM](https://docs.dynatrace.com/docs/observe/digital-experience/rum)

## Autoría y distribución

Copyright © 2026 proglopez. Derechos reservados sobre los materiales originales conforme a LICENSE. Esta publicación de referencia no se ofrece bajo una licencia de código abierto. La reserva no atribuye derechos sobre marcas, herramientas o materiales de terceros. Si se publica en GitHub, aplican las posibilidades de visualización y fork previstas en sus términos: [documentación de GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository).

