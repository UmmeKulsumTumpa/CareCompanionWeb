"use client";

import { useState, KeyboardEvent } from "react";
import { Input, Button } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
    const [value, setValue] = useState("");

    function handleSend() {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex items-end gap-2 p-4 bg-white border-t border-gray-200">
            <TextArea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a caregiving question... (Enter to send, Shift+Enter for new line)"
                autoSize={{ minRows: 1, maxRows: 5 }}
                disabled={disabled}
                className="flex-1 resize-none rounded-xl"
            />
            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="rounded-xl h-10"
            />
        </div>
    );
}
