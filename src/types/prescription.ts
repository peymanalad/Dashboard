export interface searchOptionsProps {
  search?: string;
}

export interface electronicPrescriptionVisit {
  id: number;
  head_id: number;
}

export interface electronicPrescription {
  electronic_prescription_visit: electronicPrescriptionVisit;
  visit_id: number;
}
