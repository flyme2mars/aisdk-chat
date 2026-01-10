'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  AVAILABLE_MODELS,
  type AIProvider,
  type ModelSelection,
} from '@/lib/ai/registry';

interface ProviderSelectorProps {
  selection: ModelSelection;
  onSelect: (selection: ModelSelection) => void;
  disabled?: boolean;
}

export function ProviderSelector({
  selection,
  onSelect,
  disabled,
}: ProviderSelectorProps) {
  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-muted/20">
      <div className="flex flex-wrap gap-2">
        {Object.entries(AVAILABLE_MODELS).map(([provider, models]) => (
          <div key={provider} className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
            <span className="text-xs font-semibold uppercase text-muted-foreground px-1">
              {provider}
            </span>
            <div className="flex flex-col gap-1">
              {models.map((model) => (
                <Button
                  key={model.id}
                  variant={
                    selection.provider === provider && selection.modelId === model.id
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className="justify-start font-normal h-8"
                  onClick={() =>
                    onSelect({ provider: provider as AIProvider, modelId: model.id })
                  }
                  disabled={disabled}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {selection.provider === provider && selection.modelId === model.id && (
                      <Check className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="truncate">{model.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
