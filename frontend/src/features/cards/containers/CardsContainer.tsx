import { useEffect, useMemo, useState } from "react";
import CardsTable from "../components/CardsTable";
import Modal from "@components/ui/Modal";
import CardForm from "../components/CardForm";
import type { Card } from "@models/cards.model";
import { cardsApi } from "@api/cards.api";
import { mapBackendCardToCard } from "@mappers/cards.mapper";

export default function CardsContainer() {
    const [items, setItems] = useState<Card[]>([]);
    const [isLoading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "edit">("create");
    const [selected, setSelected] = useState<Card | null>(null);

    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const modalTitle = useMemo(() => {
        if (mode === "create") return "Nueva tarjeta";
        return "Editar tarjeta";
    }, [mode]);

    const load = async () => {
        setLoading(true);
        try {
            const dto = await cardsApi.list();
            setItems(dto.map(mapBackendCardToCard));
        } catch (e: any) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setMode("create");
        setSelected(null);
        setError(null);
        setModalOpen(true);
    };

    const openEdit = (card: Card) => {
        setMode("edit");
        setSelected(card);
        setError(null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelected(null);
        setError(null);
    };

    const handleDelete = async (card: Card) => {
        const ok = confirm(`¿Eliminar tarjeta ${card.brand} •••• ${card.last4}?`);
        if (!ok) return;

        try {
            await cardsApi.remove(card.id);
            await load();
        } catch (e: any) {
            alert(
                e?.response?.data?.message ||
                "No se pudo eliminar la tarjeta. Revisa el backend."
            );
        }
    };

    const handleSubmit = async (payload: any) => {
        setSubmitting(true);
        setError(null);

        try {
            if (mode === "create") {
                const created = await cardsApi.create(payload);
                setItems((prev) => [mapBackendCardToCard(created), ...prev]);
            } else if (mode === "edit" && selected) {
                const updated = await cardsApi.update(selected.id, payload);
                const mapped = mapBackendCardToCard(updated);
                setItems((prev) => prev.map((x) => (x.id === mapped.id ? mapped : x)));
            }

            closeModal();
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.title ||
                "No se pudo guardar. Verifica los datos.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <CardsTable
                items={items}
                isLoading={isLoading}
                onCreate={openCreate}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            <Modal open={modalOpen} title={modalTitle} onClose={closeModal}>
                <CardForm
                    mode={mode}
                    initial={selected}
                    isSubmitting={isSubmitting}
                    error={error}
                    onCancel={closeModal}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </>
    );
}
