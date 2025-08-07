"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, Table, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {BloodUnit} from "@/lib/types/bloodUnit";
import {exportToCSV, exportToExcel, exportToPDF} from "@/app/utils/exportUtils";

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (config: any) => void
  data : BloodUnit | any
  dataType: "inventory" | "donors" | "requests" | "analytics"
}

export default function ExportModal({ open, onOpenChange, onExport, data, dataType }: ExportModalProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [exportConfig, setExportConfig] = useState({
    format: "",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    fields: [] as string[],
    includeCharts: false,
    includeSummary: true,
  })

  const formats = [
    { value: "excel", label: "Excel (.xlsx)", icon: Table, description: "Feuille de calcul avec formatage" },
    { value: "csv", label: "CSV (.csv)", icon: FileText, description: "Données séparées par virgules" },
    { value: "pdf", label: "PDF (.pdf)", icon: FileText, description: "Document formaté avec graphiques" },
  ]

  const getFieldsByDataType = () => {
    switch (dataType) {
      case "inventory":
        return [
          { id: "bloodType", label: "Groupe Sanguin" },
          { id: "quantity", label: "Quantité" },
          { id: "location", label: "Emplacement" },
          { id: "expirationDate", label: "Date d'Expiration" },
          { id: "donorId", label: "ID Donneur" },
          { id: "collectionDate", label: "Date de Collecte" },
          { id: "status", label: "Statut" },
        ]
      case "donors":
        return [
          { id: "name", label: "Nom Complet" },
          { id: "bloodType", label: "Groupe Sanguin" },
          { id: "phone", label: "Téléphone" },
          { id: "email", label: "Email" },
          { id: "address", label: "Adresse" },
          { id: "lastDonation", label: "Dernière Donation" },
          { id: "totalDonations", label: "Total Donations" },
          { id: "eligibility", label: "Éligibilité" },
        ]
      case "requests":
        return [
          { id: "hospital", label: "Hôpital" },
          { id: "bloodType", label: "Groupe Sanguin" },
          { id: "quantity", label: "Quantité" },
          { id: "urgency", label: "Urgence" },
          { id: "requestedBy", label: "Demandé par" },
          { id: "deadline", label: "Date Limite" },
          { id: "status", label: "Statut" },
          { id: "procedure", label: "Procédure" },
        ]
      case "analytics":
        return [
          { id: "metrics", label: "Métriques Clés" },
          { id: "trends", label: "Tendances" },
          { id: "forecasts", label: "Prévisions" },
          { id: "alerts", label: "Alertes" },
          { id: "performance", label: "Performance" },
          { id: "usage", label: "Utilisation" },
        ]
      default:
        return []
    }
  }

  const handleFieldToggle = (fieldId: string) => {
    setExportConfig((prev) => ({
      ...prev,
      fields: prev.fields.includes(fieldId) ? prev.fields.filter((f) => f !== fieldId) : [...prev.fields, fieldId],
    }))
  }

  const handleSelectAllFields = () => {
    const allFields = getFieldsByDataType().map((f) => f.id)
    setExportConfig((prev) => ({
      ...prev,
      fields: prev.fields.length === allFields.length ? [] : allFields,
    }))
  }

  const handleExport = async () => {
    setLoading(true)
    console.log(selectedFormat?.value)
    if (selectedFormat?.value === "csv") {
      exportToCSV(data);
    } else if (selectedFormat?.value === "excel") {
      exportToExcel(data);
    } else if (selectedFormat?.value === "pdf") {
      exportToPDF(data);
    } else {
      console.error("Unsupported export format");
      // Simulation de l'export
      //await new Promise((resolve) => setTimeout(resolve, 3000))
    }
    //onExport(exportConfig)
    setLoading(false)
    //onOpenChange(false)
    setDone(true)

    // Reset config
    setExportConfig({
      format: "",
      dateFrom: undefined,
      dateTo: undefined,
      fields: [],
      includeCharts: false,
      includeSummary: true,
    })
  }

  const fields = getFieldsByDataType()
  const selectedFormat = formats.find((f) => f.value === exportConfig.format)

  return (
      <Dialog open={!done ? open : done} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-500" />
              Exporter les Données
              <Badge variant="outline" className="ml-2">
                {dataType === "inventory" && "Inventaire"}
                {dataType === "donors" && "Donneurs"}
                {dataType === "requests" && "Demandes"}
                {dataType === "analytics" && "Analyses"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format d'Export */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Format d'Export *</Label>
              <div className="grid grid-cols-1 gap-3">
                {formats.map((format) => (
                    <div
                        key={format.value}
                        className={cn(
                            "flex items-center space-x-3 rounded-lg border p-3 cursor-pointer transition-colors",
                            exportConfig.format === format.value
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300",
                        )}
                        onClick={() => setExportConfig({ ...exportConfig, format: format.value })}
                    >
                      <div
                          className={cn(
                              "w-4 h-4 rounded-full border-2",
                              exportConfig.format === format.value ? "border-blue-500 bg-blue-500" : "border-gray-300",
                          )}
                      >
                        {exportConfig.format === format.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                      <format.icon className="w-5 h-5 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* Plage de Dates */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Période d'Export</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Du</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn(
                              "w-full justify-start text-left font-normal",
                              !exportConfig.dateFrom && "text-muted-foreground",
                          )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {exportConfig.dateFrom ? (
                            format(exportConfig.dateFrom, "dd/MM/yyyy", { locale: fr })
                        ) : (
                            <span>Date début</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={exportConfig.dateFrom}
                          onSelect={(date) => setExportConfig({ ...exportConfig, dateFrom: date })}
                          initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Au</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn(
                              "w-full justify-start text-left font-normal",
                              !exportConfig.dateTo && "text-muted-foreground",
                          )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {exportConfig.dateTo ? (
                            format(exportConfig.dateTo, "dd/MM/yyyy", { locale: fr })
                        ) : (
                            <span>Date fin</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                          mode="single"
                          selected={exportConfig.dateTo}
                          onSelect={(date) => setExportConfig({ ...exportConfig, dateTo: date })}
                          initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Sélection des Champs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Champs à Exporter</Label>
                <Button type="button" variant="ghost" size="sm" onClick={handleSelectAllFields}>
                  {exportConfig.fields.length === fields.length ? "Désélectionner tout" : "Sélectionner tout"}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                          id={field.id}
                          checked={exportConfig.fields.includes(field.id)}
                          onCheckedChange={() => handleFieldToggle(field.id)}
                      />
                      <label
                          htmlFor={field.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {field.label}
                      </label>
                    </div>
                ))}
              </div>
              {exportConfig.fields.length > 0 && (
                  <div className="text-xs text-gray-500">{exportConfig.fields.length} champ(s) sélectionné(s)</div>
              )}
            </div>

            {/* Options Avancées */}
            {exportConfig.format === "pdf" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Options PDF</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="includeCharts"
                          checked={exportConfig.includeCharts}
                          onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeCharts: !!checked })}
                      />
                      <label htmlFor="includeCharts" className="text-sm font-medium leading-none cursor-pointer">
                        Inclure les graphiques
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                          id="includeSummary"
                          checked={exportConfig.includeSummary}
                          onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeSummary: !!checked })}
                      />
                      <label htmlFor="includeSummary" className="text-sm font-medium leading-none cursor-pointer">
                        Inclure le résumé exécutif
                      </label>
                    </div>
                  </div>
                </div>
            )}

            {/* Aperçu de l'Export */}
            {selectedFormat && exportConfig.fields.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <selectedFormat.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Aperçu de l'Export</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Format: {selectedFormat.label}</div>
                    <div>Champs: {exportConfig.fields.length} sélectionné(s)</div>
                    {exportConfig.dateFrom && exportConfig.dateTo && (
                        <div>
                          Période: {format(exportConfig.dateFrom, "dd/MM/yyyy", { locale: fr })} -{" "}
                          {format(exportConfig.dateTo, "dd/MM/yyyy", { locale: fr })}
                        </div>
                    )}
                    {exportConfig.format === "pdf" && (
                        <div>
                          Options: {exportConfig.includeCharts ? "Avec graphiques" : "Sans graphiques"},
                          {exportConfig.includeSummary ? " avec résumé" : " sans résumé"}
                        </div>
                    )}
                  </div>
                </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
                type="button"
                onClick={handleExport}
                disabled={loading || !exportConfig.format || exportConfig.fields.length === 0}
            >
              {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Export en cours...
                  </>
              ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exporter
                  </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}
