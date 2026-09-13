# Peru Online — research notes

Research checked on 13 September 2026. Website period: 1997–2025. The user provided 1997 as their birth year; no personal memories or experiences have been invented. Events before 1997 are outside the main timeline. No source establishes 1997 as the beginning of the internet in Peru.

## Content and evidence choices

The normalized `proposed-data.json` contains ten concise milestones and four comparable statistics, with bibliography and claim mapping inside `sources`. The writing is paraphrased. Most evidence is from the organization that produced the statistic, operated the service, or managed the infrastructure. One explicitly marked exception is OSIPTEL's 2007 dissemination of newspaper reporting about INEI's household results. Government and company accounts establish dates or measurements; promotional promises are not treated as demonstrated outcomes.

The four chart values belong to the same survey, observation quarter, unit and measure. They describe households with internet service, not the proportion of residents using the internet. The 2025 estimates are preliminary. The geographical categories are defined by INEI: metropolitan Lima includes Callao, and the other urban category excludes metropolitan Lima. The national figure is an aggregate, not a fourth mutually exclusive geographical group. Do not sum the four bars.

The historical milestones deliberately use different units when appropriate. Operator accesses, cabina participation, network traffic, kilometres of fibre and household access are not a continuous statistical series. Do not place them on one trend axis or present their percentage values as comparable. In particular, do not mix INEI household access with OSIPTEL ERESTEL fixed-or-mobile household access estimates: their definitions differ.

## Source bibliography and cross-checks

1. **Inter-American Development Bank (November 1997), “Internet for the people.”** [Article](https://www.iadb.org/en/news/internet-people). The corresponding [The IDB, volume 24, number 11](https://publications.iadb.org/en/idb-vol-24-no-11-november-1997) catalogue record establishes November 1997; DOI 10.18235/0003533. The article's HTML lacks its own visible date. Describes the shared cabina model and related instruction/email services. The story can discuss how shared access worked, without borrowing the article's speculative forecasts or treating its interview estimates as national survey results.

2. **Telefónica del Perú (2003), 2002 Annual Report.** [SEC Form 6-K filed 5 May 2003](https://www.sec.gov/Archives/edgar/data/1014620/000119312503003396/d6k.htm). Reporting period is 2002; the report itself is dated February 2003. Locate “1,875” in the HTML. This supports the Speedy growth milestone, but not a claim that all Peruvian broadband began in 2002.

3. **OSIPTEL (27 March 2007), “Mayor acceso a Internet pública.”** [News item](https://www.gob.pe/institucion/osiptel/noticias/178644-mayor-acceso-a-internet-publica). The timeline year is the 2006 observation period, not the 2007 publication year. OSIPTEL attributes the figures to El Peruano's account of INEI results. Treat as institutional dissemination, not direct access to original ENAHO microdata.

4. **Diario Oficial El Peruano (20 July 2012), Law 29904.** [Official updated text](https://diariooficial.elperuano.pe/normas/obtenerdocumento?idnorma=82). The document explicitly states the original publication date. Use this as a historical policy milestone, not a description of today's complete legal framework.

5. **Ministerio de Transportes y Comunicaciones (undated), “Habilitación de la tecnología 4G-LTE.”** [Government record](https://portal.mtc.gob.pe/logros_habilitacion.html). The page contains progress as of 2018 and reports the July 2013 spectrum allocation. Do not assign the page a 2013 publication date. The award is distinct from when a particular service became available.

6. **Telefónica (2014), Informe Integrado 2013, printed page 48.** [Annual report](https://www.telefonica.com/es/wp-content/uploads/sites/4/2021/07/informe_anual_2013_es.pdf#page=48). The Peru row describes advance sales and the scheduled January 2014 operation date. This is the secondary link needed alongside the 2013 spectrum milestone; do not cite the MTC spectrum page alone for the operator's date. The report is an operator account, so the website avoids generalizing its first-mover marketing claims.

7. **Ministerio de Transportes y Comunicaciones (undated), “Logros: Red Dorsal Nacional de Fibra Óptica.”** [Government record](https://portal.mtc.gob.pe/logros_red_dorsal.html). Records September 2016 completion and carrier service. Cross-check: [MTC Anuario Estadístico 2022](https://cdn.www.gob.pe/uploads/document/file/4577337/Anuario%20Estad%C3%ADstico%202022.pdf), section 8.2, dates operations to 13 September 2016 and explains that service was supplied to telecom operators. Do not confuse planned delivery in June 2016 with recorded completion in September.

8. **Inter-American Development Bank (2019; year identified in article), “Internet para Todos: disminuyendo la brecha digital en América Latina.”** [Project account](https://www.iadb.org/es/internet-para-todos-disminuyendo-la-brecha-digital-en-america-latina). Documents Moya's launch and project participants. Cross-check [IDB, “Connected During the Pandemic With Internet Para Todos,” 15 July 2020](https://www.iadb.org/en/blog/improving-lives/connected-during-pandemic-internet-para-todos). Do not present future rollout targets as completed coverage.

9. **OSIPTEL (22 March 2020), “Tráfico de datos se incrementó sustancialmente en redes móviles y fijas en la última semana.”** [Regulator report](https://www.osiptel.gob.pe/portal-del-usuario/noticias/osiptel-trafico-de-datos-se-incremento-sustancialmente-en-redes-moviles-y-fijas-en-la-ultima-semana/). Compares a specific five-day period with the previous week. The site keeps that denominator and period explicit rather than describing an annual growth rate.

10. **OSIPTEL (24 February 2025), “Perú registró más de 4 millones de conexiones de internet fijo al cierre de 2024.”** [Market statistics](https://www.osiptel.gob.pe/portal-del-usuario/noticias/peru-registro-mas-de-4-millones-de-conexiones-de-internet-fijo-al-cierre-de-2024/). The measurement date is December 2024. Data originate in provider reporting published through PUNKU. The fibre share is a share of connections, not geographical coverage or population.

11. **INEI (March 2026), Estadísticas de las tecnologías de información y comunicación en los hogares: IV Trimestre 2025.** [Official report](https://www.inei.gob.pe/media/MenuRecursivo/boletines/boletin-tic-oct_dic2025.pdf#page=6). Household comparisons appear on printed pages 6–7, including preliminary status and geographical notes. The report's cover confirms March 2026. Use this reporting vintage consistently; older news releases may differ slightly due to revisions.

## Deliberately excluded material

- Wikipedia, anonymous social posts and AI-like downloadable “historia informática” documents were discovery leads only, not evidence.
- The INEI file `RENAMU 2007 — Plan de Tabulados` contains model tables for a survey plan. Its displayed numbers were not assumed to be final 2007 findings.
- No claim that every province, school, village or person was connected follows from a backbone route or a project target.
- No “first internet connection” milestone is included because that predates the user's lifetime and is unnecessary to explain the chosen period.
- No conversion of “percentage points” to “percent growth” is made for the geographical difference.

All cited sources were accessed on 13 September 2026. Web extraction included intermittent errors for older MTC pages and shortened gob.pe links; indexed primary-source text and the listed full official URLs were used. Bibliographic dates marked undated/inferred remain explicitly qualified.
