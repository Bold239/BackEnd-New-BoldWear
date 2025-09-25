import AdminJS, {
  ActionResponse,
  BaseRecord,
} from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';
import bcrypt from 'bcrypt';

import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import { Category } from '../models/category.model.js';
import { Video } from '../models/video.model.js';
import { ProductImage } from '../models/product-image.model.js';
import { Review } from '../models/review.model.js';
import { ReviewImage } from '../models/review-image.model.js';
import { Banner } from '../models/Banner.js';
import { MiniBanner } from '../models/mini-banner.model.js';
import { exportOrderPdf, exportMultipleOrdersPdf } from './order-export-action';
import { Order } from '../models/order.model.js';
import { ProductResource } from './product.resource.js';
import { ModelPhoto } from '../models/model-photo.model.js';
import { Modeling } from '../models/modeling.model.js';
import { Color } from '../models/color.model.js';
import uploadFeature from '@adminjs/upload'
import { categoryBannerUploadFeature, modelPhotoUploadFeature, productImageUploadFeature, videoUploadFeature } from './uploadFeatures.js';


AdminJS.bundle('./components/OpenPdf.tsx');
AdminJS.registerAdapter({
  Database: AdminJSSequelize.Database,
  Resource: AdminJSSequelize.Resource,
});

const BannerResource = {
  resource: Banner,
  options: {
    navigation: 'Banner',
    id: 'banners',
    properties: {
      imageUrl: {
        label: 'Imagem',
        isVisible: { list: true, edit: true, show: true, filter: false },
      },
      titulo: { label: 'Título Secundário' },
      tituloPrincipal: { label: 'Título Principal' },
      destaque: { label: 'Destaque (Ex: +10% off)' },
      subtitulo: { label: 'Subtítulo' },
      cupom: { label: 'Texto do cupom' },

      // Ocultando os campos extras
      mimeType: { isVisible: false },
      size: { isVisible: false },
      filename: { isVisible: false },
      bucket: { isVisible: false },
    }
  },
  features: [
    uploadFeature({
      provider: {
        local: {
          bucket: 'public/uploads',
        },
      },
      properties: {
        key: 'imageUrl',         // onde será salvo o caminho da imagem
        file: 'uploadImage',     // campo temporário para upload
        mimeType: 'mimeType',
        bucket: 'bucket',
        size: 'size',
        filename: 'filename',
      },
      uploadPath: (_record, filename) => `banners/temp-${Date.now()}-${filename}`,
    }),
  ],
}

const MiniBannerResource = {
  resource: MiniBanner,
  options: {
    navigation: 'Mini Banners',
    id: 'mini-banners',
    properties: {
      imageUrl: {
        label: 'Caminho da Imagem',
        isVisible: { list: true, show: true, edit: true },
      },
      mimeType: { isVisible: false },
      size: { isVisible: false },
      filename: { isVisible: false },
      bucket: { isVisible: false },
    },
  },
  features: [
    uploadFeature({
      provider: {
        local: {
          bucket: 'public/uploads',
        },
      },
      properties: {
        key: 'imageUrl',
        file: 'uploadImage',
        mimeType: 'mimeType',
        bucket: 'bucket',
        size: 'size',
        filename: 'filename',
      },
      uploadPath: (_record, filename) => `mini-banners/${Date.now()}-${filename}`,
    }),
  ],
}


export const adminJs = new AdminJS({
  rootPath: '/admin',
  resources: [
    BannerResource,
    {
      resource: Order,
      options: {
        navigation: 'Pedidos',
        id: 'orders',
        actions: {
          export_pdf: exportOrderPdf,
          export_pdf_zip: exportMultipleOrdersPdf,
        },
        properties: {
          recipientName: { label: 'Nome do Destinatário' },
          recipientCPF: { label: 'CPF do Destinatário' },
          recipientCEP: { label: 'CEP para Frete' },
          shippingAddress: { label: 'Endereço de Envio' },
          extraInfo: { label: 'Info Extra' },
          freight: { label: 'Valor do Frete', type: 'number' },
          createdAt: {
            isVisible: { list: true, edit: false, show: true },
            label: 'Criado em',
          },
          recipientEmail: {
            label: 'E-mail do Destinatário',
            isVisible: { list: true, show: true, edit: false, filter: true },
            position: 5, // ou qualquer posição que organize bem no painel
          },
        },
      },
    },
    {
      resource: User,
      options: {
        navigation: 'Usuários',
        id: 'users',
        properties: {
          password: {
            type: 'password',
            isVisible: {
              list: false,
              edit: true,
              show: false,
              filter: false,
            },
          },
          role: {
            availableValues: [
              { value: 'admin', label: 'Administrador' },
              { value: 'user', label: 'Usuário' },
            ],
          },
          favoriteNames: {
            label: 'Produtos Favoritados',
            isVisible: { list: false, edit: false, show: true, filter: false },
          },
          createdAt: {
            isVisible: { list: true, edit: false, show: true },
            label: 'Criado em',
          },
          updatedAt: {
            isVisible: { list: false, edit: false, show: true },
            label: 'Atualizado em',
          },
        },
        listProperties: ['email', 'role', 'createdAt'],
        showProperties: ['email', 'role', 'favoriteNames', 'createdAt', 'updatedAt'],
        editProperties: ['role'],
        filterProperties: ['email', 'role', 'createdAt'],
        actions: {
          new: {
            after: async (response: ActionResponse): Promise<ActionResponse> => {
              if (response.record?.params) {
                delete response.record.params.password;
              }
              return response;
            },
          },
          edit: {
            after: async (response: ActionResponse): Promise<ActionResponse> => {
              if (response.record?.params) {
                delete response.record.params.password;
              }
              return response;
            },
          },
          show: {
            after: async (response: ActionResponse): Promise<ActionResponse> => {
              const user = await User.findByPk(response.record?.params?.id, {
                include: [Product],
              });
              if (user) {
                const favorites = await user.getFavorites();
                response.record.params.favoriteNames = favorites.map(p => p.name).join(', ');
              }
              return response;
            },
          },
        },
      },
    },
    {
      resource: ModelPhoto,
      features: [modelPhotoUploadFeature],
      options: {
        navigation: 'Foto Dos Modelos',
        id: 'model-photos',
        properties: {
          url: {
            label: 'Imagem da Modelagem',
            isRequired: false, // 👈 remove obrigatoriedade no AdminJS
            isVisible: { list: true, show: true, edit: false, filter: false }, // 👈 oculta no formulário
          },
          productId: { label: 'Produto', reference: 'Product', isRequired: true },
          modelingId: { label: 'Nome da Modelagem', reference: 'modelings', isRequired: true },
        },
      },
    },
    {
      resource: Color,
      options: {
        navigation: 'Cores',
        id: 'colors',
        properties: {
          name: { label: 'Nome da Cor', isRequired: true },
          hex: {
            label: 'Código Hexadecimal',
            isRequired: true,
            components: {
              list: AdminJS.bundle('./components/ColorPreview'),
              show: AdminJS.bundle('./components/ColorPreview'),
            },
          },
        },
        listProperties: ['name', 'hex'],
        editProperties: ['name', 'hex'],
        showProperties: ['name', 'hex'],
      },
    },
    {
      resource: Modeling,
      options: {
        navigation: 'Modelos',
        id: 'modelings',
        properties: {
          id: { isVisible: false },
          name: { label: 'Nome da Modelagem', isRequired: true },
          createdAt: {
            isVisible: { list: true, edit: false, show: true },
            label: 'Criado em',
          },
          updatedAt: {
            isVisible: { list: true, edit: false, show: true },
            label: 'Atualizado em',
          },
        },
      },
    },
    MiniBannerResource,
    ProductResource,
    {
      resource: Category,
      features: [categoryBannerUploadFeature],
      options: {
        navigation: 'Categorias',
        id: 'categories',
        properties: {
          name: { isTitle: true, label: 'Nome da Categoria', isRequired: true },
          bannerUrl: {
            label: 'Banner da Categoria',
            isVisible: { list: true, show: true, edit: true, filter: false },
          },
          productNames: {
            position: 3,
            label: 'Produtos',
            isVisible: {
              list: true,
              show: true,
              edit: false,
              filter: false,
            },
          },
        },
        actions: {
          show: {
            after: async (response: ActionResponse): Promise<ActionResponse> => {
              const category = await Category.findByPk(response.record?.params?.id, { include: [Product] });
              const products = category?.products || [];
              response.record.params.productNames = products.map((p) => p.name).join(', ');
              return response;
            },
          },
          list: {
            after: async (response: ActionResponse): Promise<ActionResponse> => {
              await Promise.all(
                response.records.map(async (record: BaseRecord) => {
                  const category = await Category.findByPk(record.params.id, { include: [Product] });
                  const products = category?.products || [];
                  record.params.productNames = products.map((p) => p.name).join(', ');
                })
              );
              return response;
            },
          },
        },
      },
    },
    {
      resource: Video,
      options: {
        navigation: 'Videos',
        id: 'videos',
        properties: {
          id: { isVisible: false },
          title: { label: 'Título', isRequired: true },
          url: {
            label: 'Arquivo de Vídeo',
            isRequired: false, // <- isso aqui desativa a obrigatoriedade no AdminJS
            isVisible: { list: false, show: false, edit: false, filter: false },
          },
          createdAt: { label: 'Criado em', isVisible: { list: true, show: true, edit: false } },
          updatedAt: { label: 'Atualizado em', isVisible: { list: true, show: true, edit: false } },
        },
      },
      features: [videoUploadFeature],
    },
    {
      resource: ProductImage,
      options: {
        navigation: 'Imagem dos Produtos',
        id: 'product-images',
        properties: {
          id: { isVisible: false },
          url: {
            label: 'URL da Imagem',
            isRequired: false,
            isVisible: { list: false, show: false, edit: false, filter: false },
          },
          productId: {
            label: 'Produto',
            reference: 'Product',
            isRequired: true,
          },
          createdAt: { isVisible: { list: true, show: true, edit: false } },
          updatedAt: { isVisible: { list: true, show: true, edit: false } },
        },
      },
      features: [productImageUploadFeature],
    },

    {
      resource: Review,
      options: {
        navigation: 'Reviews',
        id: 'reviews',
        properties: {
          rating: {
            label: 'Nota',
            type: 'number',
            isVisible: { list: true, edit: true, show: true, filter: true },
          },
          comment: { label: 'Comentário', type: 'textarea' },
          productId: { label: 'Produto', reference: 'products' },
          userId: { label: 'Usuário', isVisible: { list: true, filter: true } },
        },
        listProperties: ['productId', 'userId', 'rating', 'createdAt'],
        filterProperties: ['productId', 'userId', 'rating'],
      },
    },
    {
      resource: ReviewImage,
      options: {
        navigation: 'Imagens dos reviews',
        id: 'review-images',
        properties: {
          url: { label: 'URL da Imagem', isRequired: true },
          reviewId: {
            label: 'Review',
            reference: 'reviews',
            isRequired: true,
          },
          createdAt: { label: 'Criado em', isVisible: { list: true, edit: false, show: true } },
        },
      },
    },
  ],
  branding: {
    companyName: 'BoldWear Admin',
    logo: false,
  },
  locale: {
    language: 'pt-BR',
    translations: {
      labels: {
        products: 'Produtos',
        users: 'Usuários',
        categories: 'Categorias',
        videos: 'Vídeos',
      },
    },
  },
});

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email: string, password: string) => {
      const user = await User.findOne({ where: { email } });
      if (!user) return null;
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;
      if (user.role !== 'admin') return null;
      return { email: user.email };
    },
    cookiePassword: process.env.COOKIE_SECRET || 'umaSenhaBemSeguraAqui',
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
  }
);
