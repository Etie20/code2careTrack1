classDiagram
direction BT
class alerts {
   integer alert_id
}
class blood_units {
   integer unit_id
}
class demand_forecasts {
   integer forecast_id
}
class department_needs {
   integer need_id
}
class departments {
   integer department_id
}
class donor_medical_history {
   integer history_id
}
class donors {
   integer donor_id
}
class inventory_transactions {
   integer transaction_id
}
class personnel {
   integer personnel_id
}
class transaction_history {
   integer history_id
}

alerts  -->  personnel : resolved_by:personnel_id
blood_units  -->  donor_medical_history : medical_history_id:history_id
blood_units  -->  donors : donor_id
demand_forecasts  -->  departments : department_id
department_needs  -->  departments : department_id
department_needs  -->  personnel : personnel_id
donor_medical_history  -->  donors : donor_id
transaction_history  -->  blood_units : unit_id
transaction_history  -->  departments : department_id
transaction_history  -->  inventory_transactions : inventory_tx_id:transaction_id
transaction_history  -->  personnel : personnel_id
