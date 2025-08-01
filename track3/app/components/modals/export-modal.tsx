"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, FileSpreadsheet, FileImage } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "inventory" | "donors" | "requests" | "analytics"
}

export default function ExportModal({ open, onOpenChange, type }: ExportModalProps) {
  const [exportConfig, setExportConfig] = useState({
    format: "excel",
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    includeFields: [] as string[],
    includeCharts: false,
    includeSummary: true,
  })
  const [isExporting, setIsExporting] = useState(false)

  const formats = [
    { value: "excel", label: "Excel (.xlsx)", icon: FileSpreadsheet },
    { value: "csv", label: "CSV (.csv)", icon: FileText },
    { value: "pdf", label: "PDF (.pdf)", icon: FileImage },
  ]

  const getAvailableFields = () => {
    switch (type) {
      case "inventory":
        return [
          { id: "bloodType", label: "Type de Sang" },
          { id: "units", label: "Unités" },
          { id: "location", label: "Emplacement" },
          { id: "expiryDate", label: "Date d'Expiration" },
          { id: "status", label: "Statut" },
          { id: "lastUpdated", label: "Dernière Mise à Jour" },
        ]
      case "donors":
        return [
          { id: "name", label: "Nom Complet" },
          { id: "bloodType", label: "Groupe Sanguin" },
          { id: "phone", label: "Téléphone" },
          { id: "email", label: "Email" },
          { id: "lastDonation", label: "Dernière Donation" },
          { id: "totalDonations", label: "Total Donations" },
          { id: "status", label: "Statut" },
          { id: "location", label: "Ville" },
        ]
      case "requests":
        return [
          { id: "hospital", label: "Hôpital" },
          { id: "bloodType", label: "Type de Sang" },
          { id: "unitsRequested", label: "Unités Demandées" },
          { id: "urgency", label: "Urgence" },
          { id: "status", label: "Statut" },
          { id: "requestDate", label: "Date de Demande" },
          { id: "requiredBy", label: "Date Limite" },
          { id: "contact", label: "Contact" },
        ]
      case "analytics":
        return [
          { id: "metrics", label: "Métriques Clés" },
          { id: "trends", label: "Tendances" },
          { id: "forecasts", label: "Prévisions" },
          { id: "efficiency", label: "Efficacité" },
          { id: "wastage", label: "Gaspillage" },
          { id: "fulfillment", label: "Taux de Satisfaction" },
        ]
      default:
        return []
    }
  }

  const handleFieldChange = (fieldId: string, checked: boolean) => {
    if (checked) {
      setExportConfig({ ...exportConfig, includeFields: [...exportConfig.includeFields, fieldId] })
    } else {
      setExportConfig({ ...exportConfig, includeFields: exportConfig.includeFields.filter((f) => f !== fieldId) })
    }
  }

  const selectAllFields = () => {
    const allFields = getAvailableFields().map((f) => f.id)
    setExportConfig({ ...exportConfig, includeFields: allFields })
  }

  const deselectAllFields = () => {
    setExportConfig({ ...exportConfig, includeFields: [] })
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulation d'export
    await new Promise((resolve) => setTimeout(resolve, 3000))

    console.log("Export configuré:", exportConfig)

    // Simulation du téléchargement
    const filename = `${type}_export_${format(new Date(), "yyyy-MM-dd")}.${exportConfig.format === "excel" ? "xlsx" : exportConfig.format}`
    console.log(`Téléchargement de: ${filename}`)

    setIsExporting(false)
    onOpenChange(false)
  }

  const getExportTitle = () => {
    switch (type) {
      case "inventory":
        return "Exporter l'Inventaire"
      case "donors":
        return "Exporter les Donneurs"
      case "requests":
        return "Exporter les Demandes"
      case "analytics":
        return "Exporter les Analytics"
      default:
        return "Exporter les Données"
    }
  }

  const availableFields = getAvailableFields()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-800">
            <Download className="w-5 h-5" />
            {getExportTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format d'Export */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Format d'Export</Label>
            <div className="grid grid-cols-3 gap-3">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportConfig({ ...exportConfig, format: format.value })}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    exportConfig.format === format.value
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <format.icon
                    className={`w-8 h-8 mx-auto mb-2 ${exportConfig.format === format.value ? "text-green-600" : "text-gray-500"}`}
                  />
                  <p
                    className={`text-sm font-medium ${exportConfig.format === format.value ? "text-green-700" : "text-gray-600"}`}
                  >
                    {format.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Plage de Dates */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Plage de Dates</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date de Début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exportConfig.dateFrom
                        ? format(exportConfig.dateFrom, "PPP", { locale: fr })
                        : "Sélectionner une date"}
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
                <Label>Date de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {exportConfig.dateTo
                        ? format(exportConfig.dateTo, "PPP", { locale: fr })
                        : "Sélectionner une date"}
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

          {/* Champs à Inclure */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Champs à Inclure</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={selectAllFields}>
                  Tout Sélectionner
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={deselectAllFields}>
                  Tout Désélectionner
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
              {availableFields.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={exportConfig.includeFields.includes(field.id)}
                    onCheckedChange={(checked) => handleFieldChange(field.id, checked as boolean)}
                  />
                  <label htmlFor={field.id} className="text-sm font-medium cursor-pointer">
                    {field.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Options Supplémentaires */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Options Supplémentaires</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSummary"
                  checked={exportConfig.includeSummary}
                  onCheckedChange={(checked) =>
                    setExportConfig({ ...exportConfig, includeSummary: checked as boolean })
                  }
                />
                <label htmlFor="includeSummary" className="text-sm font-medium cursor-pointer">
                  Inclure un résumé statistique
                </label>
              </div>
              {(type === "analytics" || type === "inventory") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={exportConfig.includeCharts}
                    onCheckedChange={(checked) =>
                      setExportConfig({ ...exportConfig, includeCharts: checked as boolean })
                    }
                  />
                  <label htmlFor="includeCharts" className="text-sm font-medium cursor-pointer">
                    Inclure les graphiques (PDF uniquement)
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || exportConfig.includeFields.length === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Export en cours...
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter ({exportConfig.includeFields.length} champs)
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
