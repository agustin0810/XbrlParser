import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { XbrlViewerComponent } from '../xbrl-viewer/xbrl-viewer.component';
import { XbrlParserService, ParsedXbrlData } from '../../services/xbrl-parser.service';

@Component({
  selector: 'app-xbrl-parser-main',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatSnackBarModule,
    FileUploadComponent,
    XbrlViewerComponent
  ],
  template: `
    <div class="main-container">
      <!-- Header principal -->
      <mat-card class="main-header">
        <mat-card-header>
          <mat-card-title class="main-title">
            <span class="title-icon">📊</span>
            Parser XBRL
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description">
            XBRL (eXtensible Business Reporting Language) es un estándar global para el intercambio 
            de información financiera y empresarial. Este parser te permite entender cómo se estructuran 
            los datos financieros en formato XBRL.
          </p>
        </mat-card-content>
      </mat-card>

      <!-- Componente de carga de archivos -->
      <app-file-upload 
        (fileProcessed)="onFileProcessed($event)">
      </app-file-upload>

      <!-- Componente de visualización -->
      <app-xbrl-viewer 
        [parsedData]="parsedData">
      </app-xbrl-viewer>

      <!-- Información educativa -->
      <mat-card class="info-card" *ngIf="!parsedData">
        <mat-card-header>
          <mat-card-title>¿Qué es XBRL?</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="info-grid">
            <div class="info-item">
              <h4>📋 Hechos (Facts)</h4>
              <p>Son los datos financieros individuales como ingresos, gastos, activos, etc. Cada hecho tiene un valor, contexto y unidad.</p>
            </div>
            <div class="info-item">
              <h4>🏢 Contextos</h4>
              <p>Definen el escenario del reporte: qué empresa, en qué período y bajo qué condiciones se reportan los datos.</p>
            </div>
            <div class="info-item">
              <h4>📏 Unidades</h4>
              <p>Especifican las unidades de medida de los valores numéricos (monedas, porcentajes, cantidades, etc.).</p>
            </div>
            <div class="info-item">
              <h4>🔗 Taxonomías</h4>
              <p>Son los diccionarios que definen qué conceptos se pueden usar y cómo se relacionan entre sí.</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .main-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .main-header {
      margin-bottom: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 8px;
    }

    .title-icon {
      font-size: 2rem;
      margin-right: 16px;
    }

    .main-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      margin-bottom: 16px;
    }

    .description {
      font-size: 1.1rem;
      line-height: 1.6;
      opacity: 0.95;
      margin: 0;
    }

    .info-card {
      margin-top: 30px;
      background-color: #f8f9fa;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-top: 20px;
    }

    .info-item {
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .info-item h4 {
      color: #667eea;
      margin: 0 0 12px 0;
      font-size: 1.1rem;
    }

    .info-item p {
      color: #555;
      line-height: 1.5;
      margin: 0;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .main-container {
        padding: 10px;
      }
      
      .main-title {
        font-size: 2rem;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class XbrlParserMainComponent {
  parsedData: ParsedXbrlData | null = null;

  constructor(private xbrlParserService: XbrlParserService) {}

  onFileProcessed(file: File): void {
    console.log('Archivo procesado:', file.name);
    
    // Usar el servicio para parsear el archivo
    this.xbrlParserService.parseXbrlFile(file).subscribe({
      next: (data) => {
        this.parsedData = data;
        console.log('Datos XBRL parseados:', data);
      },
      error: (error) => {
        console.error('Error al parsear XBRL:', error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    });
  }
}
