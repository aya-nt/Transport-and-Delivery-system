"use client"

import { useEffect, useMemo, useState } from "react"
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api"

type LatLngLiteral = { lat: number; lng: number }

export type ShipmentMapProps = {
  originAddress?: string | null
  destinationAddress?: string | null
  driverLocation?: LatLngLiteral | null
  heightClassName?: string
}

const defaultCenter: LatLngLiteral = { lat: 36.7538, lng: 3.0588 }

export default function ShipmentMap({
  originAddress,
  destinationAddress,
  driverLocation,
  heightClassName,
}: ShipmentMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey || "",
  })

  const [origin, setOrigin] = useState<LatLngLiteral | null>(null)
  const [destination, setDestination] = useState<LatLngLiteral | null>(null)
  const [directions, setDirections] = useState<any>(null)

  const mapContainerStyle = useMemo(
    () => ({ width: "100%", height: "100%" }),
    []
  )

  useEffect(() => {
    if (!isLoaded) return

    const g = (globalThis as any).google
    if (!g?.maps) return

    const geocoder = new g.maps.Geocoder()

    function geocode(address: string): Promise<LatLngLiteral | null> {
      return new Promise((resolve) => {
        geocoder.geocode({ address }, (results: any, status: any) => {
          if (status !== "OK" || !results || results.length === 0) {
            resolve(null)
            return
          }

          const loc = results[0]?.geometry?.location
          if (!loc) {
            resolve(null)
            return
          }

          resolve({ lat: loc.lat(), lng: loc.lng() })
        })
      })
    }

    ;(async () => {
      setDirections(null)

      const [o, d] = await Promise.all([
        originAddress ? geocode(originAddress) : Promise.resolve(null),
        destinationAddress ? geocode(destinationAddress) : Promise.resolve(null),
      ])

      setOrigin(o)
      setDestination(d)

      if (!o || !d) return

      const svc = new g.maps.DirectionsService()
      const result = await new Promise<any>((resolve) => {
        svc.route(
          {
            origin: o,
            destination: d,
            travelMode: g.maps.TravelMode.DRIVING,
          },
          (res: any, status: any) => {
            if (status !== "OK" || !res) {
              resolve(null)
              return
            }
            resolve(res)
          }
        )
      })

      setDirections(result)
    })()
  }, [isLoaded, originAddress, destinationAddress])

  if (!apiKey) {
    return (
      <div className={`w-full rounded-lg border bg-muted/20 ${heightClassName || "h-[420px]"}`}>
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
          Missing `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={`w-full rounded-lg border bg-muted/20 ${heightClassName || "h-[420px]"}`}>
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
          Failed to load Google Maps.
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`w-full rounded-lg border bg-muted/20 ${heightClassName || "h-[420px]"}`}>
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
          Loading map...
        </div>
      </div>
    )
  }

  const center = driverLocation || origin || destination || defaultCenter

  return (
    <div className={`w-full rounded-lg overflow-hidden border ${heightClassName || "h-[420px]"}`}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={driverLocation ? 13 : 10}>
        {origin && <Marker position={origin} label="A" />}
        {destination && <Marker position={destination} label="B" />}
        {driverLocation && <Marker position={driverLocation} label="Driver" />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  )
}
