import { ABP, PagedResultDto } from '@abp/ng.core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import {
  CreateTenant,
  DeleteTenant,
  GetTenantById,
  GetTenants,
  UpdateTenant,
} from '../actions/tenant-management.actions';
import { TenantManagement } from '../models/tenant-management';
import { Injectable } from '@angular/core';
import { TenantService } from '../proxy/tenant.service';
import { TenantDto } from '../proxy/models';
import { Observable } from 'rxjs';

@State<TenantManagement.State>({
  name: 'TenantManagementState',
  defaults: { result: {}, selectedItem: {} } as TenantManagement.State,
})
@Injectable()
export class TenantManagementState {
  @Selector()
  static get({ result }: TenantManagement.State): TenantDto[] {
    return result.items || [];
  }

  @Selector()
  static getTenantsTotalCount({ result }: TenantManagement.State): number {
    return result.totalCount;
  }

  constructor(private service: TenantService) { }

  @Action(GetTenants)
  get({ patchState }: StateContext<TenantManagement.State>, { payload }: GetTenants): Observable<PagedResultDto<TenantDto>> {
    return this.service.getList(payload).pipe(
      tap(result =>
        patchState({
          result,
        }),
      ),
    );
  }

  @Action(GetTenantById)
  getById({ patchState }: StateContext<TenantManagement.State>, { payload }: GetTenantById): Observable<TenantDto> {
    return this.service.get(payload).pipe(
      tap(selectedItem =>
        patchState({
          selectedItem,
        }),
      ),
    );
  }

  @Action(DeleteTenant)
  delete(_, { payload }: DeleteTenant): Observable<void> {
    return this.service.delete(payload);
  }

  @Action(CreateTenant)
  add(_, { payload }: CreateTenant): Observable<TenantDto> {
    return this.service.create(payload);
  }

  @Action(UpdateTenant)
  update({ getState }: StateContext<TenantManagement.State>, { payload }: UpdateTenant): Observable<TenantDto> {
    return this.service.update(payload.id, { ...getState().selectedItem, ...payload });
  }
}
