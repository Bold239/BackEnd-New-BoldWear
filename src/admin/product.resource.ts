import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import AdminJS, {
    ActionRequest,
    ActionResponse,
    ActionContext,
    BaseRecord,
} from 'adminjs';
import {
  imagePathUploadFeature,
  measureTableUploadFeature,
  fullWidthImageUploadFeature,
} from './uploadFeatures';


export const ProductResource = {
   resource: Product,
  features: [
    imagePathUploadFeature,
    measureTableUploadFeature,
    fullWidthImageUploadFeature,
  ],
  options: {
    id: 'Product',
    navigation: 'Produtos',
    properties: {
      id: { isVisible: false },
      name: { position: 1, label: 'Nome', isRequired: true },
      price: { position: 2, label: 'Preço', type: 'number', isRequired: true },
      description: { position: 3, label: 'Descrição', type: 'textarea', isRequired: true },

      imagePath: {
        position: 4,
        label: 'Imagem Principal',
        isRequired: false,
        isVisible: { list: true, show: true, edit: false, filter: false },
      },
      measureTableUrl: {
        position: 13,
        label: 'Tabela de Medidas',
        isRequired: false,
        isVisible: { list: false, show: true, edit: false, filter: false },
      },
      fullWidthImageUrl: {
        position: 14,
        label: 'Imagem em Largura Total',
        isRequired: false,
        isVisible: { list: false, show: true, edit: false, filter: false },
      },

      categories: {
        position: 5,
        label: 'Categorias',
        isArray: true,
        reference: 'categories',
        isVirtual: true,
        isVisible: {
          list: false,
          edit: true,
          show: false,
          filter: true,
        },
      },
      categoryNames: {
        position: 6,
        label: 'Categorias',
        isVisible: {
          list: true,
          show: true,
          edit: false,
          filter: false,
        },
      },
      isFeatured: {
        position: 7,
        label: 'Produto em Destaque?',
        type: 'boolean',
      },
      obs: {
        position: 8,
        label: 'Observações',
        isVisible: { list: true, edit: true, show: true, filter: true },
      },
      colors: {
        position: 10,
        label: 'Cores',
        isArray: true,
        reference: 'colors',
        isVisible: { list: false, edit: true, show: false, filter: false },
      },
      colorNames: {
        position: 11,
        label: 'Cores Selecionadas',
        isVisible: { list: true, show: true, edit: false },
      },
      modelingNames: {
        position: 12,
        label: 'Modelagens Selecionadas',
        isVisible: { list: true, show: true, edit: false },
      },
      createdAt: {
        isVisible: { list: true, edit: false, show: true },
        label: 'Criado em',
      },
      updatedAt: {
        isVisible: { list: true, edit: false, show: true },
        label: 'Atualizado em',
      },
    },
        actions: {
            new: {
                before: async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
                    const rawPayload = request.payload || {};

                    const categoryKeys = Object.keys(rawPayload).filter(k => k.startsWith('categories.'));
                    context.tempCategoryIds = categoryKeys.map(k => Number(rawPayload[k]));

                    const modelingKeys = Object.keys(rawPayload).filter(k => k.startsWith('modelings.'));
                    context.tempModelingIds = modelingKeys.map(k => Number(rawPayload[k]));

                    const colorKeys = Object.keys(rawPayload).filter(k => k.startsWith('colors.'));
                    context.tempColorIds = colorKeys.map(k => Number(rawPayload[k]));

                    return request;
                },
                after: async (response: ActionResponse, _request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
                    const productId = response.record?.params?.id;
                    if (!productId) return response;

                    const product = await Product.findByPk(productId);

                    if (context.tempCategoryIds?.length) {
                        await product?.setCategories(context.tempCategoryIds);
                        const categories = await product!.getCategories();
                        response.record.params.categoryNames = categories.map((c: Category) => c.name).join(', ');
                    }
                    if (context.tempModelingIds?.length) {
                        await product?.setModelings(context.tempModelingIds);
                    }

                    if (context.tempColorIds?.length) {
                        await product?.setColors(context.tempColorIds);
                    }


                    return response;
                },
            },

            edit: {
                before: async (request: ActionRequest, context: ActionContext): Promise<ActionRequest> => {
                    const rawPayload = request.payload || {};

                    const categoryKeys = Object.keys(rawPayload).filter(k => k.startsWith('categories.'));
                    context.tempCategoryIds = categoryKeys.map(k => Number(rawPayload[k]));
                    const modelingKeys = Object.keys(rawPayload).filter(k => k.startsWith('modelings.'));
                    context.tempModelingIds = modelingKeys.map(k => Number(rawPayload[k]));

                    const colorKeys = Object.keys(rawPayload).filter(k => k.startsWith('colors.'));
                    context.tempColorIds = colorKeys.map(k => Number(rawPayload[k]));


                    return request;
                },

                after: async (response: ActionResponse, _request: ActionRequest, context: ActionContext): Promise<ActionResponse> => {
                    const productId = response.record?.params?.id;
                    if (!productId) return response;

                    const product = await Product.findByPk(productId);

                    if (context.tempCategoryIds?.length) {
                        await product?.setCategories(context.tempCategoryIds);
                        const categories = await product!.getCategories();
                        response.record.params.categoryNames = categories.map((c: Category) => c.name).join(', ');
                    }

                    if (context.tempModelingIds?.length) {
                        await product?.setModelings(context.tempModelingIds);
                    }

                    if (context.tempColorIds?.length) {
                        await product?.setColors(context.tempColorIds);
                    }


                    return response;
                },
            },

            show: {
                after: async (response: ActionResponse): Promise<ActionResponse> => {
                    const product = await Product.findByPk(response.record?.params?.id);

                    const categories = await product?.getCategories();
                    const colors = await product?.getColors();
                    const modelings = await product?.getModelings();

                    response.record.params.categoryNames = categories?.map(c => c.name).join(', ') || '';
                    response.record.params.colorNames = colors?.map(c => c.name).join(', ') || '';
                    response.record.params.modelingNames = modelings?.map(m => m.name).join(', ') || '';

                    return response;
                },
            },

            list: {
                after: async (response: ActionResponse): Promise<ActionResponse> => {
                    await Promise.all(
                        response.records?.map(async (record: BaseRecord) => {
                            const product = await Product.findByPk(record.params.id);
                            const categories = await product?.getCategories();
                            const colors = await product?.getColors();
                            const modelings = await product?.getModelings();

                            record.params.categoryNames = categories?.map(c => c.name).join(', ') || '';
                            record.params.colorNames = colors?.map(c => c.name).join(', ') || '';
                            record.params.modelingNames = modelings?.map(m => m.name).join(', ') || '';
                        }) ?? []
                    );
                    return response;
                },
            },


            delete: {
                actionType: 'record',
                isAccessible: true,
                isVisible: true,
                handler: async (
                    request: ActionRequest,
                    response: ActionResponse,
                    context: ActionContext
                ): Promise<ActionResponse> => {
                    const { record, resource, h } = context;
                    if (!record) {
                        return {
                            notice: { message: 'Produto não encontrado.', type: 'error' },
                        };
                    }

                    try {
                        const recordId = record.id();
                        await resource.delete(recordId);

                        return {
                            redirectUrl: h.resourceUrl({ resourceId: resource.id() }),
                            notice: { message: 'Produto excluído com sucesso!', type: 'success' },
                        };
                    } catch (error) {
                        console.error('Erro ao excluir produto:', error);
                        return {
                            notice: {
                                message: 'Erro ao excluir produto. Verifique os relacionamentos.',
                                type: 'error',
                            },
                        };
                    }
                },
            },

            bulkDelete: {
                actionType: 'bulk',
                isAccessible: true,
                isVisible: true,
                handler: async (
                    request: ActionRequest,
                    response: ActionResponse,
                    context: ActionContext
                ): Promise<ActionResponse> => {
                    const { records, resource, h } = context;

                    if (!records || records.length === 0) {
                        return {
                            notice: { message: 'Nenhum produto selecionado.', type: 'error' },
                        };
                    }

                    try {
                        const recordIds = records.map((record: BaseRecord) => record.id());
                        await Promise.all(recordIds.map((id) => resource.delete(id)));

                        return {
                            records: [],
                            notice: {
                                message: `${recordIds.length} produtos excluídos com sucesso.`,
                                type: 'success',
                            },
                            redirectUrl: '/admin/resources/Product',
                        };
                    } catch (error) {
                        console.error('Erro ao excluir produtos em lote:', error);
                        return {
                            notice: {
                                message: 'Erro ao excluir os produtos. Verifique os relacionamentos.',
                                type: 'error',
                            },
                        };
                    }
                },
            },
        },
    },
};
