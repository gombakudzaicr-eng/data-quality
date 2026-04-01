
import { createRouter, createWebHistory } from 'vue-router'

// Views
import DashboardOverview from '../views/DashboardOverview.vue'
import DataQuality from '../views/DataQuality.vue'
import EDASummary from '../views/EDASummary.vue'
import Visualizations from '../views/Visualizations.vue'
import Correlation from '../views/Correlation.vue'
import KeyManagement from '../views/KeyManagement.vue'
import MergeDatasets from '../views/MergeDatasets.vue'
import ReportsExport from '../views/ReportsExport.vue'

const routes = [
  {
    path: '/',
    redirect: '/overview',
  },
  {
    path: '/overview',
    name: 'Overview',
    component: DashboardOverview,
  },
  {
    path: '/data-quality',
    name: 'DataQuality',
    component: DataQuality,
  },
  {
    path: '/eda-summary',
    name: 'EDASummary',
    component: EDASummary,
  },
  {
    path: '/visualizations',
    name: 'Visualizations',
    component: Visualizations,
  },
  {
    path: '/correlation',
    name: 'Correlation',
    component: Correlation,
  },
  {
    path: '/key-management',
    name: 'KeyManagement',
    component: KeyManagement,
  },
  {
    path: '/merge-datasets',
    name: 'MergeDatasets',
    component: MergeDatasets,
  },
  {
    path: '/reports-export',
    name: 'ReportsExport',
    component: ReportsExport,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router