# 📊 Parser XBRL Educativo

Un proyecto educativo para aprender sobre **XBRL (eXtensible Business Reporting Language)** usando Angular. Este parser te permite cargar, analizar y visualizar archivos XBRL para entender cómo se estructuran los datos financieros.

## 🎯 ¿Qué es XBRL?

XBRL es un estándar global para el intercambio de información financiera y empresarial. Permite que los datos financieros sean legibles tanto para humanos como para máquinas, facilitando su análisis y comparación.

### Conceptos Clave:

- **📋 Hechos (Facts)**: Datos financieros individuales como ingresos, gastos, activos, etc.
- **🏢 Contextos**: Definen el escenario del reporte (empresa, período, condiciones)
- **📏 Unidades**: Especifican las unidades de medida (monedas, porcentajes, cantidades)
- **🔗 Taxonomías**: Diccionarios que definen conceptos y sus relaciones

## 🚀 Características del Proyecto

- **Carga de Archivos**: Drag & drop de archivos XBRL/XML
- **Parser Inteligente**: Extracción automática de hechos, contextos y unidades
- **Visualización Interactiva**: Múltiples vistas con pestañas organizadas
- **Interfaz Moderna**: Diseño responsive con Angular Material
- **Educativo**: Explicaciones claras de cada concepto XBRL

## 🛠️ Tecnologías Utilizadas

- **Angular 17** - Framework principal
- **Angular Material** - Componentes de UI
- **xml2js** - Parser de XML
- **TypeScript** - Tipado estático
- **SCSS** - Estilos avanzados

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── file-upload/          # Carga de archivos
│   │   ├── xbrl-viewer/          # Visualización de datos
│   │   └── xbrl-parser-main/     # Componente principal
│   ├── services/
│   │   └── xbrl-parser.service.ts # Lógica de parsing
│   └── app.ts                     # Componente raíz
├── sample-files/
│   └── ejemplo-financiero.xbrl   # Archivo de ejemplo
└── styles.scss                    # Estilos globales
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd XbrlParser
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar el proyecto**
   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:4200
   ```

### Uso del Parser

1. **Cargar Archivo**: Arrastra un archivo XBRL o haz clic para seleccionar
2. **Procesar**: Haz clic en "Procesar Archivo" 
3. **Explorar**: Navega por las diferentes pestañas para ver:
   - **Hechos**: Datos financieros extraídos
   - **Contextos**: Información de entidades y períodos
   - **Unidades**: Definiciones de medidas
   - **XML Original**: Estructura completa del archivo

## 📊 Archivo de Ejemplo

El proyecto incluye `sample-files/ejemplo-financiero.xbrl` con datos financieros de muestra que incluyen:
- Activos, pasivos y patrimonio
- Ingresos y ganancias netas
- Ganancias por acción
- Ratios financieros

## 🔧 Desarrollo

### Comandos Útiles

```bash
# Servidor de desarrollo
npm start

# Build de producción
npm run build

# Tests unitarios
npm test

# Linting
npm run lint
```

### Agregar Nuevas Funcionalidades

1. **Nuevos Campos**: Modifica las interfaces en `xbrl-parser.service.ts`
2. **Nuevas Vistas**: Crea componentes en `components/`
3. **Validaciones**: Extiende la lógica en el servicio de parsing

## 📚 Aprendizaje XBRL

### Recursos Recomendados

- [XBRL.org](https://xbrl.org/) - Documentación oficial
- [Wikipedia XBRL](https://es.wikipedia.org/wiki/XBRL) - Conceptos básicos
- [SEC EDGAR](https://www.sec.gov/edgar/searchedgar/companysearch) - Ejemplos reales

### Conceptos para Profundizar

- **Taxonomías XBRL**: Estructuras de conceptos financieros
- **Linkbases**: Relaciones entre conceptos
- **Validación XBRL**: Reglas de negocio y consistencia
- **XBRL Global Ledger**: Estándar para contabilidad detallada

## 🤝 Contribuciones

Este es un proyecto educativo. Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crea una rama para tu feature
3. Commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es educativo y está disponible bajo licencia MIT.

## 🆘 Soporte

Si tienes preguntas sobre:
- **XBRL**: Consulta la documentación oficial
- **Angular**: Revisa la [documentación de Angular](https://angular.dev/)
- **Proyecto**: Abre un issue en GitHub

---

**¡Disfruta aprendiendo sobre XBRL! 🎓📊**
