"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { enrollInCourse, getCourses, type Course } from "@/lib/api";
import { CourseList } from "@/components/course-list";
import { EnrollmentForm } from "@/components/enrollment-form";
import { HeroSection } from "@/components/hero-section";

const initialEnrollment = {
  cursoId: "",
  nome: "",
  email: "",
  whatsapp: "",
};

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [enrollmentForm, setEnrollmentForm] = useState(initialEnrollment);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const data = await getCourses();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
        setEnrollmentForm((current) => ({ ...current, cursoId: data[0].id }));
      }
    } catch (error) {
      console.error(error);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os cursos no momento. Verifique a API.",
      );
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setIsLoadingCourses(true);
        const data = await getCourses();
        if (!isMounted) return;

        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
          setEnrollmentForm((current) => ({ ...current, cursoId: data[0].id }));
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setStatusMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os cursos no momento. Verifique a API.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingCourses(false);
        }
      }
    };

    void fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleEnrollment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await enrollInCourse({
        cursoId: enrollmentForm.cursoId,
        nome: enrollmentForm.nome,
        email: enrollmentForm.email,
        whatsapp: enrollmentForm.whatsapp,
      });

      setStatusMessage("Inscrição enviada com sucesso.");
      setEnrollmentForm(initialEnrollment);
      if (courses[0]) {
        setSelectedCourseId(courses[0].id);
        setEnrollmentForm((current) => ({ ...current, cursoId: courses[0].id }));
      }
    } catch (error) {
      console.error(error);
      setStatusMessage(error instanceof Error ? error.message : "Não foi possível realizar a inscrição.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnrollmentCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setEnrollmentForm((current) => ({ ...current, cursoId: courseId }));
  };

  const handleEnrollmentFieldChange = (field: keyof typeof initialEnrollment, value: string) => {
    setEnrollmentForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">RotaProdutiva</Link>
          <nav className="flex flex-wrap items-center justify-end gap-4 text-sm text-slate-300 sm:gap-6">
            <Link href="/#cursos" className="transition hover:text-white">Cursos</Link>
            <Link href="/#inscricao" className="transition hover:text-white">Inscrição</Link>
            <Link href="/tutor" className="transition hover:text-white">Tutor</Link>
            <Link href="/admin" className="transition hover:text-white">Admin</Link>
          </nav>
        </header>

        <HeroSection statusMessage={statusMessage} />

        <section id="cursos">
          <CourseList
            courses={courses}
            selectedCourseId={selectedCourseId}
            isLoadingCourses={isLoadingCourses}
            onRefresh={() => void loadCourses()}
            onSelectCourse={handleEnrollmentCourseChange}
          />
        </section>

        <section id="inscricao" className="mt-16">
          <EnrollmentForm
            selectedCourseId={selectedCourseId}
            courses={courses}
            enrollmentForm={enrollmentForm}
            isSubmitting={isSubmitting}
            onCourseChange={handleEnrollmentCourseChange}
            onFieldChange={handleEnrollmentFieldChange}
            onSubmit={handleEnrollment}
          />
        </section>
      </div>
    </main>
  );
}
