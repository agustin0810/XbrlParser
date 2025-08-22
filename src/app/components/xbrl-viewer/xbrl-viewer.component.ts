import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParsedXbrlData, XbrlFact, XbrlContext, XbrlUnit } from '../../services/xbrl-parser.service';

@Component({
  selector: 'app-xbrl-viewer',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTableModule, 
    MatTabsModule, 
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div *ngIf="parsedData" class="viewer-container">
      <!-- Header con información del archivo -->
      <mat-card class="file-header">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>description</mat-icon>
            {{ parsedData.fileName }}
          </mat-card-title>
          <mat-card-subtitle>
            Archivo XBRL procesado correctamente
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ parsedData.facts.length }}</span>
              <span class="stat-label">Hechos (Facts)</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ parsedData.contexts.length }}</span>
              <span class="stat-label">Contextos</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ parsedData.units.length }}</span>
              <span class="stat-label">Unidades</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getUniqueEntities() }}</span>
              <span class="stat-label">Entidades</span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Pestañas para diferentes vistas -->
      <mat-tab-group class="viewer-tabs">
        <!-- Pestaña de Hechos -->
        <mat-tab label="Hechos (Facts)">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Datos Financieros Extraídos</mat-card-title>
                <mat-card-subtitle>
                  Información principal del documento XBRL
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="table-container">
                  <table mat-table [dataSource]="parsedData.facts" class="data-table">
                    <ng-container matColumnDef="name">
                      <th mat-header-cell *matHeaderCellDef>Concepto</th>
                      <td mat-cell *matCellDef="let fact">
                        <div class="fact-name">
                          <mat-icon class="fact-icon">data_object</mat-icon>
                          {{ fact.name }}
                        </div>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="value">
                      <th mat-header-cell *matHeaderCellDef>Valor</th>
                      <td mat-cell *matCellDef="let fact">
                        <span class="fact-value" [class.numeric]="isNumeric(fact.value)">
                          {{ formatValue(fact.value) }}
                        </span>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="context">
                      <th mat-header-cell *matHeaderCellDef>Contexto</th>
                      <td mat-cell *matCellDef="let fact">
                        <mat-chip *ngIf="fact.contextRef" color="primary" variant="outlined">
                          {{ fact.contextRef }}
                        </mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="unit">
                      <th mat-header-cell *matHeaderCellDef>Unidad</th>
                      <td mat-cell *matCellDef="let fact">
                        <mat-chip *ngIf="fact.unitRef" color="accent" variant="outlined">
                          {{ fact.unitRef }}
                        </mat-chip>
                      </td>
                    </ng-container>

                    <ng-container matColumnDef="decimals">
                      <th mat-header-cell *matHeaderCellDef>Decimales</th>
                      <td mat-cell *matCellDef="let fact">
                        <span *ngIf="fact.decimals" class="decimals">
                          {{ fact.decimals }}
                        </span>
                      </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
                  </table>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Pestaña de Contextos -->
        <mat-tab label="Contextos">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Contextos de Reporte</mat-card-title>
                <mat-card-subtitle>
                  Información sobre entidades, períodos y escenarios
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="contexts-grid">
                  <mat-expansion-panel *ngFor="let context of parsedData.contexts" class="context-panel">
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>business</mat-icon>
                        {{ context.id }}
                      </mat-panel-title>
                      <mat-panel-description>
                        {{ context.entity }} - {{ context.period }}
                      </mat-panel-description>
                    </mat-expansion-panel-header>
                    
                    <div class="context-details">
                      <div class="detail-row">
                        <strong>ID:</strong> {{ context.id }}
                      </div>
                      <div class="detail-row">
                        <strong>Entidad:</strong> {{ context.entity }}
                      </div>
                      <div class="detail-row">
                        <strong>Período:</strong> {{ context.period }}
                      </div>
                      <div class="detail-row" *ngIf="context.scenario">
                        <strong>Escenario:</strong> {{ context.scenario }}
                      </div>
                    </div>
                  </mat-expansion-panel>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Pestaña de Unidades -->
        <mat-tab label="Unidades">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Unidades de Medida</mat-card-title>
                <mat-card-subtitle>
                  Definiciones de unidades utilizadas en el reporte
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="units-grid">
                  <div *ngFor="let unit of parsedData.units" class="unit-card">
                    <mat-icon class="unit-icon">straighten</mat-icon>
                    <div class="unit-info">
                      <div class="unit-id">{{ unit.id }}</div>
                      <div class="unit-measure">{{ unit.measure }}</div>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Pestaña de XML Raw -->
        <mat-tab label="XML Original">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Estructura XML Original</mat-card-title>
                <mat-card-subtitle>
                  Vista del documento XBRL en formato XML
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="xml-container">
                  <pre class="xml-content">{{ formatXml(parsedData.rawData) }}</pre>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <div *ngIf="!parsedData" class="no-data">
      <mat-card>
        <mat-card-content class="no-data-content">
          <mat-icon class="no-data-icon">info</mat-icon>
          <p>No hay datos XBRL para mostrar.</p>
          <p>Por favor, carga un archivo XBRL para comenzar.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .viewer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .file-header {
      margin-bottom: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .stat-number {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      display: block;
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    .viewer-tabs {
      margin-top: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 16px;
    }

    .data-table {
      width: 100%;
    }

    .fact-name {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .fact-icon {
      font-size: 18px;
      color: #1976d2;
    }

    .fact-value {
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }

    .fact-value.numeric {
      color: #2e7d32;
      text-align: right;
    }

    .decimals {
      color: #666;
      font-size: 12px;
    }

    .contexts-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .context-panel {
      margin-bottom: 8px;
    }

    .context-details {
      padding: 16px 0;
    }

    .detail-row {
      margin: 8px 0;
      padding: 4px 0;
    }

    .units-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }

    .unit-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
    }

    .unit-icon {
      color: #ff9800;
      font-size: 24px;
    }

    .unit-info {
      flex: 1;
    }

    .unit-id {
      font-weight: bold;
      color: #333;
    }

    .unit-measure {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
    }

    .xml-container {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 16px;
      overflow-x: auto;
    }

    .xml-content {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      color: #333;
      margin: 0;
      white-space: pre-wrap;
    }

    .no-data {
      max-width: 600px;
      margin: 100px auto;
      text-align: center;
    }

    .no-data-content {
      text-align: center;
      padding: 40px;
    }

    .no-data-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .no-data-content p {
      color: #666;
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      .viewer-container {
        padding: 10px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .units-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class XbrlViewerComponent implements OnChanges {
  @Input() parsedData: ParsedXbrlData | null = null;

  displayedColumns: string[] = ['name', 'value', 'context', 'unit', 'decimals'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parsedData'] && this.parsedData) {
      console.log('Datos XBRL cargados:', this.parsedData);
    }
  }

  getUniqueEntities(): number {
    if (!this.parsedData) return 0;
    return [...new Set(this.parsedData.contexts.map(c => c.entity))].length;
  }

  isNumeric(value: string): boolean {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  }

  formatValue(value: string): string {
    if (this.isNumeric(value)) {
      const num = parseFloat(value);
      return num.toLocaleString('es-ES', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
      });
    }
    return value;
  }

  formatXml(data: any): string {
    return JSON.stringify(data, null, 2);
  }
}
