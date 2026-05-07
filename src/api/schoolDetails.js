import { apiFetch, apiPatch, apiPost } from "./liferay";

export const getSchoolDetails = (schoolProfileId) =>
  apiFetch(
    `/o/c/schooldetailses`,
  ).then((d) => (d.items || []) || null);

  export const saveSchoolDetails = (schoolProfileId,payload) =>
    apiPost("/o/c/schooldetailses", payload);
  export const patchSchoolDetails  = (id, payload) =>
    apiPatch(`/o/c/schooldetailses/${id}`, payload);