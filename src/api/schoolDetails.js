import { apiFetch, apiPatch, apiPost } from "./liferay";

export const getSchoolDetails = (schoolProfileId) =>
  apiFetch(
    `/o/c/schooldetailses`,
  ).then((d) => (d.items || []) || null);

  export const saveSchoolDetails = (payload) =>
    apiPost("/o/c/schooldetailses", payload);
  export const patchSchoolDetails  = (id, payload) =>
    apiPost(`/o/c/schooldetailses`, payload);