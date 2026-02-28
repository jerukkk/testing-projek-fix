import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {presentationTool, defineLocations} from 'sanity/presentation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'bismillah',

  projectId: 'ny2z8d3s',
  dataset: 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            ...S.documentTypeListItems().filter(item => !['media.tag'].includes(item.getId()))
          ])
    }),
    visionTool(),
    presentationTool({
      previewUrl: {
        initial: 'http://localhost:3000', // Sesuaikan dengan URL aplikasi Anda
        previewMode: {
          enable: '/api/draft/enable', // Endpoint untuk mengaktifkan draft mode
          disable: '/api/draft/disable', // Endpoint untuk menonaktifkan draft mode
        },
      },
      resolve: {
        locations: {
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => {
              if (!doc) {
                return { locations: [] };
              }
              
              // Pastikan slug tersedia dan buat URL yang benar
              const slug = doc.slug?.current || doc.slug;
              if (!slug) {
                return { locations: [] };
              }
              
              return {
                locations: [
                  {
                    title: doc.title || 'Untitled Post',
                    href: `/articles/${encodeURIComponent(slug)}`, // Mengubah /blog ke /articles sesuai struktur folder
                  },
                ],
              };
            },
          }),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
