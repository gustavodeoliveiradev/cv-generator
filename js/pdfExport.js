/**
 * Exportação PDF Profissional - VERSÃO FONTES CORRIGIDAS
 */

const PDFExport = {
    A4_WIDTH: 210,
    A4_HEIGHT: 297,

    init() {
        console.log('📄 PDF Export v2.3 (fontes corrigidas)');
    },

    async export() {
        if (!this.hasContent()) {
            Utils.showToast('❌ Preencha seu currículo antes de exportar!');
            return;
        }

        Utils.showToast('📄 Gerando PDF... Aguarde', 3000);

        try {
            const cleanContainer = this.createCleanContainer();
            document.body.appendChild(cleanContainer);
            await this.wait(500);

            const canvas = await html2canvas(cleanContainer, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 800,
                height: Math.max(cleanContainer.offsetHeight, 600)
            });

            document.body.removeChild(cleanContainer);

            if (!canvas || canvas.width < 100 || canvas.height < 100) {
                throw new Error('Canvas inválido');
            }

            const pdf = this.canvasToPDF(canvas);
            const fileName = this.generateFileName();
            pdf.save(fileName);

            Utils.showToast('✅ PDF baixado!');

        } catch (error) {
            console.error('❌ Erro PDF:', error);
            Utils.showToast('❌ Erro: ' + error.message);
        }
    },

    createCleanContainer() {
        const data = State.data;
        const theme = Themes.currentTheme;

        // 🎨 CORES de cada tema
        const themeColors = {
            minimal: { 
                primary: '#2563eb',
                text: '#1f2937',
                bg: '#ffffff',
                accent: '#3b82f6'
            },
            modern: { 
                primary: '#4f46e5',
                text: '#0f172a',
                bg: '#f8fafc',
                accent: '#6366f1'
            },
            creative: { 
                primary: '#b45309',
                text: '#451a03',
                bg: '#fffbeb',
                accent: '#f59e0b'
            }
        };

        const colors = themeColors[theme] || themeColors.minimal;

        // 🚨 CORREÇÃO: Fontes corretas por tema
        const fontMap = {
            'inter': 'Inter, Arial, sans-serif',
            'roboto': 'Roboto, Arial, sans-serif',
            'playfair': '"Playfair Display", Georgia, "Times New Roman", serif',
            'montserrat': 'Montserrat, Arial, sans-serif',
            'opensans': '"Open Sans", Arial, sans-serif'
        };

        const selectedFont = Themes.currentFont || 'inter';
        const baseFont = fontMap[selectedFont] || fontMap['inter'];

        // Fonte para títulos (serif no creative, sans nos outros)
        const headingFont = theme === 'creative' 
            ? '"Playfair Display", Georgia, serif'  // Sempre serif no creative
            : baseFont;

        console.log('PDF Fontes:', { tema: theme, base: selectedFont, heading: headingFont });

        const container = document.createElement('div');
        container.id = 'pdf-temp-container';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 800px;
            background: ${colors.bg};
            padding: 50px 60px;
            font-family: ${baseFont};
            color: ${colors.text};
            line-height: 1.6;
            box-sizing: border-box;
        `;

        container.innerHTML = this.buildCleanHTML(data, colors, theme, headingFont, baseFont);
        return container;
    },

    buildCleanHTML(data, colors, theme, headingFont, baseFont) {
        const p = data.personal;

        const isCreative = theme === 'creative';
        const isModern = theme === 'modern';

        // Header com variações por tema
        const headerBorder = isCreative 
            ? `border-bottom: 3px solid ${colors.primary}; position: relative;`
            : `border-bottom: 3px solid ${colors.primary};`;

        const headerAfter = isCreative 
            ? `<div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 80px; height: 4px; background: ${colors.accent}; border-radius: 2px;"></div>` 
            : '';

        // 🚨 CORREÇÃO: Título com fonte correta
        const titleStyle = isCreative
            ? `font-size: 52px; margin: 0 0 15px 0; color: ${colors.text}; font-weight: 700; font-family: ${headingFont};`
            : (isModern 
                ? `font-size: 48px; margin: 0 0 12px 0; color: ${colors.primary}; font-weight: 800; letter-spacing: -1px; font-family: ${headingFont};`
                : `font-size: 48px; margin: 0 0 12px 0; color: ${colors.text}; font-weight: 700; letter-spacing: -0.5px; font-family: ${headingFont};`);

        const subtitleStyle = isCreative
            ? `font-size: 20px; margin: 0 0 20px 0; color: ${colors.primary}; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; font-family: ${baseFont};`
            : `font-size: 22px; margin: 0 0 18px 0; color: ${colors.primary}; font-weight: 600; font-family: ${baseFont};`;

        let html = `
            <div style="text-align: center; margin-bottom: 35px; padding-bottom: 25px; ${headerBorder}">
                ${headerAfter}
                <h1 style="${titleStyle}">${p.fullName || 'Seu Nome'}</h1>
                <p style="${subtitleStyle}">${p.jobTitle || ''}</p>
                <div style="font-size: 15px; color: #666; line-height: 1.8; font-family: ${baseFont};">
                    ${p.email ? `<span style="margin: 0 12px;">📧 ${p.email}</span>` : ''}
                    ${p.phone ? `<span style="margin: 0 12px;">📱 ${p.phone}</span>` : ''}
                    ${p.location ? `<span style="margin: 0 12px;">📍 ${p.location}</span>` : ''}
                </div>
            </div>
        `;

        // Seções com estilo por tema
        const sectionTitleStyle = isCreative
            ? `font-size: 18px; color: ${colors.primary}; margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 2px dashed ${colors.accent}33; font-weight: 700; font-family: ${headingFont};`
            : `font-size: 16px; color: ${colors.primary}; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 18px 0; padding-bottom: 10px; border-bottom: 2px solid #eee; font-weight: 700; font-family: ${headingFont};`;

        if (p.summary) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="${sectionTitleStyle}">Resumo Profissional</h2>
                    <p style="margin: 0; color: #555; line-height: 1.8; font-size: 15px; font-family: ${baseFont};">${p.summary}</p>
                </div>
            `;
        }

        if (data.experience.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="${sectionTitleStyle}">Experiência Profissional</h2>
            `;

            data.experience.forEach(exp => {
                const companyStyle = isCreative
                    ? `font-size: 15px; color: ${colors.primary}; margin: 0 0 10px 0; font-weight: 700; font-family: ${baseFont};`
                    : `font-size: 15px; color: ${colors.primary}; margin: 0 0 10px 0; font-weight: 600; font-family: ${baseFont};`;

                html += `
                    <div style="margin-bottom: 25px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                            <h3 style="font-size: 18px; margin: 0; color: ${colors.text}; font-weight: 600; font-family: ${headingFont};">${exp.title || 'Cargo'}</h3>
                            <span style="font-size: 14px; color: #888; font-weight: 500; font-family: ${baseFont};">${exp.date || ''}</span>
                        </div>
                        <p style="${companyStyle}">${exp.company || ''}</p>
                        <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.7; font-family: ${baseFont};">${exp.description || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        if (data.education.length > 0) {
            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="${sectionTitleStyle}">Educação</h2>
            `;

            data.education.forEach(edu => {
                html += `
                    <div style="margin-bottom: 18px;">
                        <div style="display: flex; justify-content: space-between; align-items: baseline;">
                            <h3 style="font-size: 17px; margin: 0; color: ${colors.text}; font-weight: 600; font-family: ${headingFont};">${edu.degree || 'Curso'}</h3>
                            <span style="font-size: 14px; color: #888; font-weight: 500; font-family: ${baseFont};">${edu.date || ''}</span>
                        </div>
                        <p style="font-size: 15px; color: ${colors.primary}; margin: 6px 0 0 0; font-weight: 600; font-family: ${baseFont};">${edu.school || ''}</p>
                    </div>
                `;
            });

            html += '</div>';
        }

        if (data.skills.length > 0) {
            const skillStyle = isCreative
                ? `background: ${colors.primary}; color: white; padding: 8px 16px; border-radius: 20px 0 20px 0; font-size: 13px; font-weight: 600; font-family: ${baseFont};`
                : (isModern
                    ? `background: transparent; border: 2px solid ${colors.primary}; color: ${colors.primary}; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; font-family: ${baseFont};`
                    : `background: ${colors.primary}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; font-family: ${baseFont};`);

            html += `
                <div style="margin-bottom: 30px;">
                    <h2 style="${sectionTitleStyle}">Habilidades</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            `;

            data.skills.forEach(skill => {
                if (skill.trim()) {
                    html += `<span style="${skillStyle}">${skill.trim()}</span>`;
                }
            });

            html += '</div></div>';
        }

        return html;
    },

    canvasToPDF(canvas) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');

        const imgWidthPx = canvas.width;
        const imgHeightPx = canvas.height;

        const marginMm = 8;
        const maxWidthMm = this.A4_WIDTH - (marginMm * 2);
        const maxHeightMm = this.A4_HEIGHT - (marginMm * 2);

        const pxToMm = 0.264583;
        const imgWidthMm = (imgWidthPx / 2) * pxToMm;
        const imgHeightMm = (imgHeightPx / 2) * pxToMm;

        const scaleX = maxWidthMm / imgWidthMm;
        const scaleY = maxHeightMm / imgHeightMm;
        const scale = Math.min(scaleX, scaleY);

        let finalWidth = imgWidthMm * scale;
        let finalHeight = imgHeightMm * scale;

        if (!Number.isFinite(finalWidth) || finalWidth <= 0) finalWidth = 190;
        if (!Number.isFinite(finalHeight) || finalHeight <= 0) finalHeight = 270;

        const x = (this.A4_WIDTH - finalWidth) / 2;
        const y = marginMm;

        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

        return pdf;
    },

    hasContent() {
        const data = State.data;
        return data.personal.fullName || data.experience.length > 0 || data.education.length > 0;
    },

    generateFileName() {
        const name = State.data.personal.fullName || 'Curriculo';
        const cleanName = name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const date = new Date().toISOString().split('T')[0];
        return `CV_${cleanName}_${date}.pdf`;
    },

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
