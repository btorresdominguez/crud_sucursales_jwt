import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MonedaService, Moneda } from '../../services/moneda.service';
import { SucursalesService, Sucursal } from '../../services/sucursales.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucursales-form',
  standalone: true,
  templateUrl: './sucursales-form.component.html',
  styleUrls: ['./sucursales-form.component.scss'],
  imports: [
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    ReactiveFormsModule,
    CommonModule,
    NzModalModule,
    FormsModule,
    NzCardModule,
    NzTableModule,   
  ]
})
export class SucursalesFormComponent implements OnInit {
  form!: FormGroup;
  monedas: Moneda[] = [];
   sucursales: Sucursal[] = []; // Para almacenar la lista de sucursales

  visibleModal = false;
  saving = false;
  editingSucursalId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private monedaSvc: MonedaService,
    private sucSvc: SucursalesService,
    private msg: NzMessageService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadMonedas();
    this.loadSucursales();
  }

  private initForm(): void {
    this.form = this.fb.group({
      codigoBusqueda: [null],
      codigo: [null, Validators.required],
      descripcion: [null, [Validators.required, Validators.maxLength(250)]],
      direccion: [null, [Validators.required, Validators.maxLength(250)]],
      identificacion: [null, [Validators.required, Validators.maxLength(50)]],
      fechaCreacion: [new Date(), Validators.required],
      idMoneda: [null, Validators.required],
      estado: [true, Validators.required]

    });
  }

  private loadMonedas(): void {
    this.monedaSvc.getMonedas().subscribe({
      next: data => {
        this.monedas = data;
        console.log('Monedas cargadas:', this.monedas);
      },
      error: () => this.msg.error('Error cargando monedas')
    });
  }
   private loadSucursales(): void {
    this.sucSvc.getAll().subscribe({
      next: data => {
        this.sucursales = data; // Almacenar las sucursales
        console.log('Sucursales cargadas:', this.sucursales);
      },
      error: () => this.msg.error('Error cargando sucursales')
    });
  }
  compareFn = (o1: any, o2: any) => o1 && o2 ? o1.id === o2.id : o1 === o2;

 submit(): void {
  if (this.form.invalid) {
    this.msg.error('Corrige los errores');
    return;
  }

  const sucursalData = this.prepararSucursal();

  this.sucSvc.create(sucursalData).subscribe({
    next: () => {
      this.msg.success('Sucursal creada exitosamente');
      this.resetForm();
      this.loadSucursales(); // <<--- AQUÍ para refrescar la lista
    },
    error: (err) => {
      console.error('Error creando sucursal:', err);
      this.msg.error(err?.error?.message || 'Error al crear la sucursal');
    }
  });
}


  buscarSucursal(): void {
    const codigoBusquedaControl = this.form.get('codigoBusqueda');
    const codigo = String(codigoBusquedaControl?.value || '').trim();

    if (!codigo) {
      this.msg.warning('Ingrese un código para buscar');
      return;
    }

    this.sucSvc.getById(Number(codigo)).subscribe({
      next: sucursal => {
        console.log('Sucursal encontrada:', sucursal);

        this.editingSucursalId = sucursal.codigo ? Number(sucursal.codigo) : null;
        this.form.patchValue({
          codigo: sucursal.codigo,
          descripcion: sucursal.descripcion,
          direccion: sucursal.direccion,
          identificacion: sucursal.identificacion,
          fechaCreacion: sucursal.fechaCreacion.substring(0, 10),
          idMoneda: sucursal.idMoneda,
          estado: sucursal.estado
        });

        this.visibleModal = true;
      },
      error: err => {
        console.error('Error al buscar la sucursal:', err);
        this.msg.warning('No se encontró sucursal con ese código. Puedes crearla.');

        this.editingSucursalId = null;
        this.form.patchValue({
          codigo: codigo,
          descripcion: null,
          direccion: null,
          identificacion: null,
          fechaCreacion: new Date().toISOString().substring(0, 10),
          idMoneda: null
        });

        this.visibleModal = true;
      }
    });
  }

  guardarCambios(): void {
    if (this.editingSucursalId) {
      this.updateSucursal();
    } else {
      this.submit();
    }
  }

 private updateSucursal(): void {
  if (this.form.invalid) {
    this.msg.error('Corrige los errores');
    return;
  }

  const sucursalData = this.prepararSucursal();
  this.saving = true;

  this.sucSvc.update(this.editingSucursalId!, sucursalData).subscribe({
    next: () => {
      this.msg.success('Sucursal actualizada');
      this.resetForm();
      this.loadSucursales();  // <-- refresca la lista después de actualizar
    },
    error: (err) => {
      console.error('Error actualizando sucursal:', err);
      this.msg.error('Error actualizando');
      this.saving = false;
    }
  });
}


 eliminarSucursal(): void {
  if (!this.editingSucursalId) return;

  this.sucSvc.delete(this.editingSucursalId).subscribe({
    next: () => {
      this.msg.success('Sucursal eliminada');
      this.resetForm();
      this.loadSucursales(); // recargar la lista
    },
    error: (err) => {
      console.error('Error eliminando sucursal:', err);
      this.msg.error('Error eliminando');
      this.loadSucursales();
    }
  });
}

  handleCancel(): void {
    this.visibleModal = false;
    this.editingSucursalId = null;
  }

  private resetForm(): void {
    this.visibleModal = false;
    this.editingSucursalId = null;
    this.saving = false;
    this.form.reset();
    this.form.patchValue({ fechaCreacion: new Date() });
  }

  private prepararSucursal() {
    const formValue = this.form.value;
    console.log('Valores del formulario antes de enviar:', formValue);

    let fecha: Date;
    if (typeof formValue.fechaCreacion === 'string') {
      const [year, month, day] = formValue.fechaCreacion.split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else {
      fecha = new Date(formValue.fechaCreacion);
    }

    return {
      codigo: formValue.codigo,
      descripcion: formValue.descripcion,
      direccion: formValue.direccion,
      identificacion: formValue.identificacion,
      fechaCreacion: fecha.toISOString(),
      idMoneda: formValue.idMoneda,
      estado: formValue.estado
    };
  }
  editarSucursal(sucursal: Sucursal): void {
  console.log('Editar sucursal', sucursal);
  this.editingSucursalId = sucursal.codigo ? Number(sucursal.codigo) : null;
  this.form.patchValue({
    codigo: sucursal.codigo,
    descripcion: sucursal.descripcion,
    direccion: sucursal.direccion,
    identificacion: sucursal.identificacion,
    fechaCreacion: sucursal.fechaCreacion.substring(0, 10),
    idMoneda: sucursal.idMoneda,
    estado: sucursal.estado
  });
  this.visibleModal = true;
}

eliminarSucursalDirecto(sucursal: Sucursal): void {
  if (!sucursal.codigo) return;

  this.sucSvc.delete(Number(sucursal.codigo)).subscribe({
    next: () => {
      this.msg.success('Sucursal eliminada');
      this.loadSucursales(); // volver a cargar la lista después de eliminar
    },
    error: (err) => {
      console.error('Error eliminando sucursal:', err);
      this.msg.error('Error eliminando');
    }
  });
}
logout(): void {   
    this.router.navigate(['/login']); //redireccionando al login
}

}
