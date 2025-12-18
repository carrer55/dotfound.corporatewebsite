import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
    ogUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    ogTitle,
    ogDescription,
    ogUrl
}) => {
    useEffect(() => {
        document.title = title;

        const updateMetaTag = (property: string, content: string) => {
            let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
            if (!element) {
                element = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
            }
            if (!element) {
                element = document.createElement('meta');
                if (property.startsWith('og:')) {
                    element.setAttribute('property', property);
                } else {
                    element.setAttribute('name', property);
                }
                document.head.appendChild(element);
            }
            element.content = content;
        };

        updateMetaTag('description', description);
        updateMetaTag('og:title', ogTitle || title);
        updateMetaTag('og:description', ogDescription || description);
        if (ogUrl) {
            updateMetaTag('og:url', ogUrl);
        }
    }, [title, description, ogTitle, ogDescription, ogUrl]);

    return null;
};
