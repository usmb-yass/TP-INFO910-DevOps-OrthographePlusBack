export function getLocalDateString(date: Date, timezone: string = 'UTC'): string {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        // formatToParts garantit de récupérer l'année, le mois et le jour indépendamment de la locale
        const parts = formatter.formatToParts(date);
        const year = parts.find(p => p.type === 'year')?.value;
        const month = parts.find(p => p.type === 'month')?.value;
        const day = parts.find(p => p.type === 'day')?.value;
        
        return `${year}-${month}-${day}`;
    } catch (error) {
        // Fallback sécurisé en UTC natif sans Intl
        return date.toISOString().split('T')[0];
    }
}

export function getDaysDifference(date1: Date, date2: Date, timezone: string = 'UTC'): number {
    const d1Str = getLocalDateString(date1, timezone);
    const d2Str = getLocalDateString(date2, timezone);
    
    const d1 = new Date(`${d1Str}T00:00:00Z`);
    const d2 = new Date(`${d2Str}T00:00:00Z`);
    
    const diffTime = d1.getTime() - d2.getTime();
    
    // Utilisation de Math.round pour absorber les éventuelles secondes intercalaires
    return Math.round(diffTime / (1000 * 3600 * 24));
}
