import { describe, it, expect, beforeEach } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';
import { inicializarStorage, storage } from '../lib/storage';

describe('storage seed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('carrega dados seed sem erro', () => {
    inicializarStorage();

    const registros = storage.getRegistros();
    const habitos = storage.getHabitos();
    const tarefas = storage.getTarefas();
    const financas = storage.getFinancas();
    const metas = storage.getMetas();
    const projetos = storage.getProjetos();
    const pessoas = storage.getPessoas();

    expect(registros.length).toBeGreaterThan(0);
    expect(habitos.length).toBeGreaterThan(0);
    expect(tarefas.length).toBeGreaterThan(0);
    expect(metas.length).toBeGreaterThan(0);
    expect(projetos.length).toBeGreaterThan(0);
    expect(pessoas.length).toBeGreaterThan(0);

    expect(registros[0]).toHaveProperty('data');
    expect(habitos[0]).toHaveProperty('nome');
  });

  it('nao sobrescreve dados existentes', () => {
    localStorage.setItem('nexus_registros', JSON.stringify([{ data: '2025-01-01' }]));
    inicializarStorage();
    const registros = storage.getRegistros();
    expect(registros).toHaveLength(1);
    expect(registros[0].data).toBe('2025-01-01');
  });
});

describe('storage CRUD basico', () => {
  beforeEach(() => {
    localStorage.clear();
    inicializarStorage();
  });

  it('getRegistroPorData retorna registro existente', () => {
    const registros = storage.getRegistros();
    if (registros.length > 0) {
      const data = registros[0].data;
      const encontrado = storage.getRegistroPorData(data);
      expect(encontrado).not.toBeNull();
      expect(encontrado!.data).toBe(data);
    }
  });

  it('actualizarRegistro cria novo registro se nao existir', () => {
    const novo = { data: '2099-12-31', humor: 10, estresse: 1 };
    storage.actualizarRegistro(novo as any);
    const encontrado = storage.getRegistroPorData('2099-12-31');
    expect(encontrado).not.toBeNull();
    expect(encontrado!.humor).toBe(10);
  });
});
