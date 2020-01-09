import { Redirect } from 'react-router-dom'

import Application from '../components/Application/Application';
import Home from '../components/Home/Home';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage';
import BibPage from '../components/BibPage/BibPage';
import HoldRequest from '../components/HoldRequest/HoldRequest';
import HoldConfirmation from '../components/HoldConfirmation/HoldConfirmation';
import ElectronicDelivery from '../components/ElectronicDelivery/ElectronicDelivery';
import SubjectHeadingPageWrapper from '../components/SubjectHeading/SubjectHeadingPageWrapper';
import NotFound404 from '../components/NotFound404/NotFound404';

export const routes = [
  {
    path: "/",
    exact: true,
    component: Home
  },
  {
    path: "/search",
    component: SearchResultsPage
  },
  {
    path: "/bib/:bibId",
    component: BibPage
  },
  {
    path: "/bib/:bibId/all",
    component: BibPage
  },
  {
    path: "/hold/request/:bibId-:itemId",
    component: HoldRequest
  },
  {
    path: "/hold/request/:bibId-:itemId/edd",
    component: ElectronicDelivery
  },
  {
    path: "/hold/confirmation/:bibId-:itemId",
    component: HoldConfirmation
  },
  {
    path: "/subject_headings/:subjectHeadingUuid",
    component: SubjectHeadingPageWrapper
  },
  {
    path: "/subject_headings",
    component: SubjectHeadingPageWrapper
  },
  {
    path: "/404",
    component: NotFound404
  },
  {
    path: "*",
    component: Redirect,
    to: "/404"
  },
]
