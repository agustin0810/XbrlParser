import { Injectable } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface XbrlFact {
  name: string;
  value: string;
  contextRef?: string;
  unitRef?: string;
  decimals?: string;
  period?: string;
}

export interface XbrlContext {
  id: string;
  entity: string;
  period: string;
  scenario?: string;
}

export interface XbrlUnit {
  id: string;
  measure: string;
}

export interface ParsedXbrlData {
  facts: XbrlFact[];
  contexts: XbrlContext[];
  units: XbrlUnit[];
  rawData: any;
  fileName: string;
}

@Injectable({
  providedIn: 'root'
})
export class XbrlParserService {

  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '_text',
      parseAttributeValue: true,
      parseTagValue: true,
      trimValues: true
    });
  }

  /**
   * Parsea un archivo XBRL y extrae la información estructurada
   */
  parseXbrlFile(file: File): Observable<ParsedXbrlData> {
    return from(this.readFileAsText(file)).pipe(
      map(xmlContent => this.parseXmlContent(xmlContent, file.name))
    );
  }

  /**
   * Lee el archivo como texto
   */
  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  /**
   * Parsea el contenido XML del archivo XBRL
   */
  private parseXmlContent(xmlContent: string, fileName: string): ParsedXbrlData {
    let parsedData: any = {};
    
    try {
      // Parsear XML usando fast-xml-parser
      parsedData = this.xmlParser.parse(xmlContent);
    } catch (error) {
      console.error('Error parsing XBRL:', error);
      throw new Error('Error al parsear el archivo XBRL');
    }

    // Extraer datos estructurados
    const facts = this.extractFacts(parsedData);
    const contexts = this.extractContexts(parsedData);
    const units = this.extractUnits(parsedData);

    return {
      facts,
      contexts,
      units,
      rawData: parsedData,
      fileName
    };
  }

  /**
   * Extrae los hechos (facts) del documento XBRL
   */
  private extractFacts(data: any): XbrlFact[] {
    const facts: XbrlFact[] = [];
    
    if (data.xbrl) {
      // Buscar elementos que no sean context, unit, o schemaRef
      Object.keys(data.xbrl).forEach(key => {
        if (!['context', 'unit', 'schemaRef', 'linkbaseRef'].includes(key)) {
          const element = data.xbrl[key];
          if (element && typeof element === 'object') {
            // Manejar arrays y elementos individuales
            if (Array.isArray(element)) {
              element.forEach(item => {
                facts.push(this.createFactFromElement(key, item));
              });
            } else {
              facts.push(this.createFactFromElement(key, element));
            }
          }
        }
      });
    }

    return facts;
  }

  /**
   * Crea un fact desde un elemento XML
   */
  private createFactFromElement(name: string, element: any): XbrlFact {
    return {
      name: name,
      value: element._text || element.toString() || '',
      contextRef: element['@_contextRef'],
      unitRef: element['@_unitRef'],
      decimals: element['@_decimals'],
      period: element['@_period']
    };
  }

  /**
   * Extrae los contextos del documento XBRL
   */
  private extractContexts(data: any): XbrlContext[] {
    const contexts: XbrlContext[] = [];
    
    if (data.xbrl && data.xbrl.context) {
      const contextArray = Array.isArray(data.xbrl.context) 
        ? data.xbrl.context 
        : [data.xbrl.context];
      
      contextArray.forEach((context: any) => {
        if (context['@_id'] && context.entity && context.period) {
          contexts.push({
            id: context['@_id'],
            entity: this.extractEntityIdentifier(context.entity),
            period: this.extractPeriod(context.period),
            scenario: this.extractScenario(context.scenario)
          });
        }
      });
    }

    return contexts;
  }

  /**
   * Extrae el identificador de la entidad
   */
  private extractEntityIdentifier(entity: any): string {
    if (entity.identifier && entity.identifier._text) {
      return entity.identifier._text;
    }
    if (entity.identifier) {
      return entity.identifier.toString();
    }
    return 'N/A';
  }

  /**
   * Extrae el período del contexto
   */
  private extractPeriod(period: any): string {
    if (period.startDate && period.endDate) {
      return `${period.startDate._text || period.startDate} - ${period.endDate._text || period.endDate}`;
    }
    if (period.instant) {
      return period.instant._text || period.instant;
    }
    if (period._text) {
      return period._text;
    }
    return 'N/A';
  }

  /**
   * Extrae el escenario del contexto
   */
  private extractScenario(scenario: any): string | undefined {
    if (!scenario) return undefined;
    
    if (scenario.dimension && scenario.dimension._text) {
      return scenario.dimension._text;
    }
    if (scenario._text) {
      return scenario._text;
    }
    return undefined;
  }

  /**
   * Extrae las unidades del documento XBRL
   */
  private extractUnits(data: any): XbrlUnit[] {
    const units: XbrlUnit[] = [];
    
    if (data.xbrl && data.xbrl.unit) {
      const unitArray = Array.isArray(data.xbrl.unit) 
        ? data.xbrl.unit 
        : [data.xbrl.unit];
      
      unitArray.forEach((unit: any) => {
        if (unit['@_id'] && unit.measure) {
          units.push({
            id: unit['@_id'],
            measure: this.extractMeasure(unit.measure)
          });
        }
      });
    }

    return units;
  }

  /**
   * Extrae la medida de la unidad
   */
  private extractMeasure(measure: any): string {
    if (Array.isArray(measure)) {
      return measure.map(m => m._text || m).join(' / ');
    }
    if (measure._text) {
      return measure._text;
    }
    return measure.toString();
  }

  /**
   * Obtiene estadísticas básicas del archivo XBRL parseado
   */
  getXbrlStats(data: ParsedXbrlData): any {
    return {
      totalFacts: data.facts.length,
      totalContexts: data.contexts.length,
      totalUnits: data.units.length,
      uniqueEntities: [...new Set(data.contexts.map(c => c.entity))].length,
      fileSize: data.fileName ? 'N/A' : 'N/A'
    };
  }
}
