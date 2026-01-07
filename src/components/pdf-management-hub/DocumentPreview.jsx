"use client"
import React, { useState, useEffect } from "react"
import Icon from "../../components/AppIcon"
import Button from "../../components/ui/Button"

const DocumentPreview = ({ selectedFile, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load PDF
  useEffect(() => {
    if (selectedFile?.cloudinaryUrl) {
      setIsLoading(true)
      setPdfUrl(selectedFile.cloudinaryUrl)
      setCurrentPage(1)
      setTimeout(() => setIsLoading(false), 500)
    } else {
      setPdfUrl(null)
    }
  }, [selectedFile])

  const totalPages = selectedFile?.pageCount || 12

  const handleZoomIn = () => setZoomLevel(p => Math.min(p + 25, 200))
  const handleZoomOut = () => setZoomLevel(p => Math.max(p - 25, 50))
  const handleResetZoom = () => setZoomLevel(100)
  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1))
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages))

  const handlePageInput = (e) => {
    const page = Number(e.target.value)
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const toggleFullscreen = () => setIsFullscreen(p => !p)

  const handleDownload = () => {
    if (pdfUrl) window.open(pdfUrl, "_blank")
  }

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center bg-card border-l border-border">
        <div className="text-center max-w-sm p-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="FileText" size={24} color="var(--color-muted-foreground)" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Document Selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Select a PDF file from the left panel to preview it here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col bg-card ${isFullscreen ? "fixed inset-0 z-50" : "border-l border-border"}`}>

      {/* HEADER */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-error/10 rounded flex items-center justify-center">
              <Icon name="FileText" size={16} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground truncate">
                {selectedFile?.name}
              </h2>
              <p className="text-xs text-muted-foreground">
                {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB • {totalPages} pages
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={14} />
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={14} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between">

          {/* PAGE CONTROLS */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1} iconName="ChevronLeft" />
            <input
              type="number"
              value={currentPage}
              onChange={handlePageInput}
              min={1}
              max={totalPages}
              className="w-12 text-xs text-center border rounded"
            />
            <span className="text-xs text-muted-foreground">
              of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages} iconName="ChevronRight" />
          </div>

          {/* ZOOM */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel === 50} iconName="ZoomOut" />
            <span className="text-xs min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel === 200} iconName="ZoomIn" />
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              Reset
            </Button>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" iconName="RotateCw" />
            <Button variant="outline" size="sm" iconName="Download" onClick={handleDownload} />
            <Button variant="outline" size="sm" iconName="Share" />
          </div>

        </div>
      </div>

      {/* PDF VIEW */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div className="flex justify-center">
          {isLoading && <span>Loading PDF...</span>}

          {!isLoading && pdfUrl && (
            <div
              className="bg-white shadow-lg rounded-lg overflow-hidden"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
                maxWidth: "800px",
                width: "100%",
              }}
            >
              <iframe
                src={`${pdfUrl}#page=${currentPage}`}
                className="w-full"
                style={{ height: "842px" }}
                title={selectedFile?.name}
              />
            </div>
          )}

          {!isLoading && !pdfUrl && (
            <span className="text-error">Failed to load PDF</span>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-2 border-t border-border bg-muted/30 text-xs text-muted-foreground flex justify-between">
        <span>Page {currentPage} of {totalPages}</span>
        <span>Zoom: {zoomLevel}%</span>
        <span>Size: {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB</span>
      </div>

    </div>
  )
}

export default DocumentPreview
