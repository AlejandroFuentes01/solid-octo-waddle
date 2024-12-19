"use client";

import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const areas = [
    "Presidencia Municipal",
    "Oficialía Mayor",
    "Secretaría Particular",
    "Tesorería",
    "SARE y Catastro",
    "Contraloría Municipal",
    "Dirección de Desarrollo Económico",
    "Dirección de Desarrollo Social",
    "DIF Municipal",
    "Secretaría del Ayuntamiento",
    "Seguridad Pública y Tránsito Municipal",
    "Turismo Municipal",
    "Protección Civil",
    "Atención Ciudadana",
    "Transparencia",
    "Juventud",
    "Control Canino Municipal",
    "Instituto de la Mujer Comalteca",
    "Servicios Públicos Municipales",
];

export default function AreaSelector({ selectedArea, setSelectedArea }: { selectedArea: string; setSelectedArea: (value: string) => void }) {
    const [query, setQuery] = useState("");

    const filteredAreas =
        query === ""
            ? areas
            : areas.filter((area) =>
                area.toLowerCase().includes(query.toLowerCase())
            );

    return (
        <div className="relative">
            <Combobox value={selectedArea} onChange={setSelectedArea}>
                <div className="relative w-full">
                    <Combobox.Input
                        className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Seleccione un área"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </Combobox.Button>
                </div>
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredAreas.length === 0 && query !== "" ? (
                        <div className="cursor-default select-none relative py-2 px-4 text-gray-700">
                            No se encontraron resultados.
                        </div>
                    ) : (
                        filteredAreas.map((area, idx) => (
                            <Combobox.Option
                                key={idx}
                                value={area}
                                className={({ active }) =>
                                    `cursor-default select-none relative py-2 pl-3 pr-9 ${active ? "text-white bg-blue-600" : "text-gray-900"
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`block truncate ${selected ? "font-medium" : "font-normal"
                                                }`}
                                        >
                                            {area}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? "text-white" : "text-blue-600"
                                                    }`}
                                            >
                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        ))
                    )}
                </Combobox.Options>
            </Combobox>
        </div>
    );
}
